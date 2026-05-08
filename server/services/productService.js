import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const productService = {

    async getProducts({
        categoryId,
        leagueId,
        teamId,
        search,
        pageNumber,
        pageSize
    }) {

        const pool = await connectDB();

        const request = pool.request()
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize);

        const filters = [];

        if (categoryId) {
            filters.push('p.CategoryId = @CategoryId');
            request.input('CategoryId', sql.Int, categoryId);
        }

        if (leagueId) {
            filters.push('p.LeagueId = @LeagueId');
            request.input('LeagueId', sql.Int, leagueId);
        }

        if (teamId) {
            filters.push('p.TeamId = @TeamId');
            request.input('TeamId', sql.Int, teamId);
        }

        if (search) {
            filters.push(`(
      p.Name LIKE @Search
    )`);

            request.input('Search', sql.NVarChar, `%${search}%`);
        }

        const whereClause = filters.length
            ? `WHERE ${filters.join(' AND ')}`
            : '';

        const result = await request.query(`
    SELECT
      p.Id AS id,
      p.Name AS name,
      p.Price AS price,
      p.Description AS description,
      p.TeamId AS teamId,
      t.Name AS teamName,
      p.LeagueId as leagueId,
      l.Name AS leagueName,
      p.CategoryId AS categoryId,
      c.Name AS categoryName,
      i.ImageUrl AS mainImage
    FROM dbo.Products p
    JOIN dbo.ProductImages i
      ON p.Id = i.ProductId
      AND i.IsMain = 1
    JOIN dbo.Teams t
      ON p.TeamId = t.Id
    JOIN dbo.Leagues l
      ON p.LeagueId = l.Id
    JOIN dbo.Categories c
      ON p.CategoryId = c.Id
    ${whereClause}
    ORDER BY p.Id
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY
  `);

        const products = result.recordset;

        for (const product of products) {

            const sizesResult = await pool.request()
                .input('ProductId', sql.Int, product.id)
                .query(`
        SELECT
            s.Id AS SizeId,
            s.Name AS SizeName,
            ISNULL(ps.Stock, 0) AS Stock
        FROM dbo.Sizes s
        LEFT JOIN dbo.ProductSizes ps
            ON s.Id = ps.SizeId
            AND ps.ProductId = @ProductId
        ORDER BY s.Id
    `);

            product.sizes = sizesResult.recordset;
        }

        return products;

    },

    async getProductById(productId) {

        const pool = await connectDB();

        const productResult = await pool.request()
            .input("Id", sql.Int, productId)
            .query(`
                    SELECT
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Description,
                        p.TeamId,
                        t.Name AS TeamName,
                        p.LeagueId,
                        l.Name AS LeagueName,
                        p.CategoryId,
                        c.Name AS CategoryName
                    FROM dbo.Products p
                    JOIN dbo.Teams t ON p.TeamId = t.Id
                    JOIN dbo.Leagues l ON p.LeagueId = l.Id
                    JOIN dbo.Categories c ON p.CategoryId = c.Id
                    WHERE p.Id = @Id
                    `)

        if (productResult.recordset.length === 0) {
            throw new Error("Product not found!")
        }

        const product = productResult.recordset[0];

        const imagesResult = await pool.request()
            .input("ProductId", sql.Int, productId)
            .query(`
                        SELECT Id, ImageUrl, IsMain
                        FROM dbo.ProductImages
                        Where ProductId = @ProductId
                    `);

        const sizesResult = await pool.request()
            .input("ProductId", sql.Int, productId)
            .query(`
                        SELECT ps.Id, ps.SizeId, s.Name AS SizeName, ps.Stock
                        FROM dbo.ProductSizes ps
                        JOIN dbo.Sizes s ON ps.SizeId = s.Id
                        WHERE ProductId = @ProductId
                    `);

        return {
            ...product,
            images: imagesResult.recordset,
            sizes: sizesResult.recordset
        };
    },

    async createProduct(categoryId, leagueId, teamId, productName, price, description, images, productSizes) {

        const pool = await connectDB();

        const productResult = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueId", sql.Int, leagueId)
            .input("TeamId", sql.Int, teamId)
            .input("Name", sql.NVarChar, productName)
            .input("Price", sql.Decimal(10, 2), price)
            .input("Description", sql.NVarChar, description)
            .query(`
                    INSERT INTO dbo.Products (CategoryId, LeagueId, TeamId, Name, Description, Price)
                    OUTPUT INSERTED.*
                            VALUES (@CategoryId, @LeagueId, @TeamId, @Name, @Description, @Price)
                            `)

        const product = productResult.recordset[0];

        for (const img of images) {
            await pool.request()
                .input("ProductId", sql.Int, product.Id)
                .input("ImageUrl", sql.NVarChar, img.url)
                .input("IsMain", sql.Bit, img.isMain)
                .query(`
                        INSERT INTO dbo.ProductImages (ProductId, ImageUrl, IsMain)
                        VALUES (@ProductId, @ImageUrl, @IsMain)
                            `);
        }

        for (const size of productSizes) {
            await pool.request()
                .input("ProductId", sql.Int, product.Id)
                .input("SizeId", sql.Int, size.id)
                .input("Stock", sql.Int, size.stock)
                .query(`
                        INSERT INTO dbo.ProductSizes (ProductId, SizeId, Stock)
                        VALUES (@ProductId, @SizeId, @Stock)    
                            `)
        }

        return {
            ...product,
            images,
            productSizes
        };
    },


    async updateProduct(productId, categoryId, leagueId, teamId, productName, description, price, images, sizes) {
        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            const request = new sql.Request(transaction);

            await request
                .input("Id", sql.Int, productId)
                .input("CategoryId", sql.Int, categoryId)
                .input("LeagueId", sql.Int, leagueId)
                .input("TeamId", sql.Int, teamId)
                .input("Name", sql.NVarChar, productName)
                .input("Description", sql.NVarChar, description)
                .input("Price", sql.Decimal(10, 2), price)
                .query(`
                UPDATE Products
                SET Name = @Name,
                    Description = @Description,
                    Price = @Price,
                    CategoryId = @CategoryId,
                    LeagueId = @LeagueId,
                    TeamId = @TeamId
                WHERE Id = @Id;
            `);

            const imgReq = new sql.Request(transaction);
            const existingImages = await imgReq
                .input("ProductId", sql.Int, productId)
                .query(`SELECT Id FROM ProductImages WHERE ProductId = @ProductId`);
            const existingImageIds = existingImages.recordset.map(i => Number(i.Id));
            const newImageIds = images.filter(i => i.id != null).map(i => Number(i.id));

            // If there is not a photo as Main Photo, we are making the first photo Main
            if (!images.some(img => img.isMain)) {
                if (images.length > 0) {
                    images[0].isMain = true;
                }
            }

            // Adding or updating the photos
            for (const img of images) {
                if (!img.id) {
                    await new sql.Request(transaction)
                        .input("ProductId", sql.Int, productId)
                        .input("ImageUrl", sql.NVarChar, img.url)
                        .input("IsMain", sql.Bit, img.isMain ? 1 : 0)
                        .query(`
                        INSERT INTO ProductImages (ProductId, ImageUrl, IsMain)
                        VALUES (@ProductId, @ImageUrl, @IsMain)
                    `);
                } else {
                    await new sql.Request(transaction)
                        .input("Id", sql.Int, Number(img.id))
                        .input("ImageUrl", sql.NVarChar, img.url)
                        .input("IsMain", sql.Bit, img.isMain ? 1 : 0)
                        .query(`
                        UPDATE ProductImages
                        SET ImageUrl = @ImageUrl,
                            IsMain = @IsMain
                        WHERE Id = @Id
                    `);
                }

                // If this photo is main, removing the others from the main photo
                if (img.isMain) {
                    await new sql.Request(transaction)
                        .input("ProductId", sql.Int, productId)
                        .input("Id", sql.Int, img.id ? Number(img.id) : 0)
                        .query(`
                        UPDATE ProductImages
                        SET IsMain = 0
                        WHERE ProductId = @ProductId AND Id <> @Id
                    `);
                }
            }

            // Deleting photos if they are not still there
            for (const id of existingImageIds) {
                if (!newImageIds.includes(id)) {
                    await new sql.Request(transaction)
                        .input("Id", sql.Int, id)
                        .query(`DELETE FROM ProductImages WHERE Id = @Id`);
                }
            }

            const sizeReq = new sql.Request(transaction);
            const existingSizes = await sizeReq
                .input("ProductId", sql.Int, productId)
                .query(`SELECT SizeId FROM ProductSizes WHERE ProductId = @ProductId`);
            const existingSizeIds = existingSizes.recordset.map(s => Number(s.SizeId));
            const newSizeIds = sizes.map(s => Number(s.id));

            for (const size of sizes) {
                if (!existingSizeIds.includes(Number(size.id))) {
                    await new sql.Request(transaction)
                        .input("ProductId", sql.Int, productId)
                        .input("SizeId", sql.Int, Number(size.id))
                        .input("Stock", sql.Int, size.stock)
                        .query(`
                        INSERT INTO ProductSizes (ProductId, SizeId, Stock)
                        VALUES (@ProductId, @SizeId, @Stock)
                    `);
                } else {
                    await new sql.Request(transaction)
                        .input("ProductId", sql.Int, productId)
                        .input("SizeId", sql.Int, Number(size.id))
                        .input("Stock", sql.Int, size.stock)
                        .query(`
                        UPDATE ProductSizes
                        SET Stock = @Stock
                        WHERE ProductId = @ProductId AND SizeId = @SizeId
                    `);
                }
            }

            // Deleting the sizes which are not available (Can optimaze later)
            for (const sizeId of existingSizeIds) {
                if (!newSizeIds.includes(sizeId)) {
                    await new sql.Request(transaction)
                        .input("ProductId", sql.Int, productId)
                        .input("SizeId", sql.Int, sizeId)
                        .query(`DELETE FROM ProductSizes WHERE ProductId = @ProductId AND SizeId = @SizeId`);
                }
            }

            await transaction.commit();

            const productResult = await pool.request()
                .input("Id", sql.Int, productId)
                .query(`SELECT * FROM Products WHERE Id = @Id`);
            const product = productResult.recordset[0];

            const imagesResult = await pool.request()
                .input("ProductId", sql.Int, productId)
                .query(`SELECT * FROM ProductImages WHERE ProductId = @ProductId`);
            const updatedImages = imagesResult.recordset;

            const sizesResult = await pool.request()
                .input("ProductId", sql.Int, productId)
                .query(`
                SELECT ps.SizeId, s.Name, ps.Stock
                FROM ProductSizes ps
                JOIN Sizes s ON ps.SizeId = s.Id
                WHERE ps.ProductId = @ProductId
            `);
            const updatedSizes = sizesResult.recordset;

            return {
                ...product,
                images: updatedImages,
                sizes: updatedSizes
            };

        } catch (err) {
            if (!transaction._aborted) {
                await transaction.rollback();
            }
            throw err;
        }
    },

    async deleteProduct(productId) {
        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            const checkProductRes = await request
                .input("Id", sql.Int, productId)
                .query(`SELECT * FROM dbo.Products WHERE Id = @Id`);

            if (checkProductRes.recordset.length < 1) {
                throw new Error("Product not found!");
            }

            await request
                .input("ProductId", sql.Int, productId)
                .query(`DELETE FROM dbo.ProductImages WHERE ProductId = @ProductId`);

            await request
                .input("ProductId", sql.Int, productId)
                .query(`DELETE FROM dbo.ProductSizes WHERE ProductId = @ProductId`);

            await request
                .input("Id", sql.Int, productId)
                .query(`DELETE FROM dbo.Products WHERE Id = @Id`);

            await transaction.commit();
            return { message: "Product deleted successfully." };

        } catch (err) {
            if (!transaction._aborted) {
                await transaction.rollback();
            }
            throw err;
        }
    },

    async countProducts({ categoryId, leagueId, teamId }) {
        const pool = await connectDB();

        let filter = "";
        let request = pool.request();

        if (teamId) {
            filter = "WHERE TeamId = @TeamId";
            request.input("TeamId", sql.Int, teamId);
        } else if (leagueId) {
            filter = "WHERE LeagueId = @LeagueId";
            request.input("LeagueId", sql.Int, leagueId);
        } else if (categoryId) {
            filter = "WHERE CategoryId = @CategoryId";
            request.input("CategoryId", sql.Int, categoryId);
        }

        const result = await request.query(`
        SELECT COUNT(*) AS total
        FROM dbo.Products
        ${filter}
    `);

        return result.recordset[0].total;
    },

    async getProductSizes() {
        const pool = await connectDB();
        const result = await pool.request()
            .query(`SELECT 
	                    Id as id, 
	                    Name as name 
                    FROM dbo.Sizes;`);

        return result.recordset;
    }

};

export default productService;