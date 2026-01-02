import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const productService = {

    async getAllProducts(pageNumber, pageSize) {
        const pool = await connectDB();

        const result = await pool.request()
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize)
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
            c.Name AS CategoryName,
            i.ImageUrl AS MainImage
            FROM dbo.Products p
            JOIN dbo.ProductImages i ON p.Id = i.ProductId AND i.IsMain = 1
            JOIN dbo.Teams t ON p.TeamId = t.Id
            JOIN dbo.Leagues l ON p.LeagueId = l.Id
            JOIN dbo.Categories c ON p.CategoryId = c.Id
            ORDER BY p.Id
            OFFSET (@PageNumber - 1) * @PageSize ROWS
            FETCH NEXT @PageSize ROWS ONLY
            `);

        return result.recordset;
    },

    async getProductsByCategory(categoryId, pageNumber, pageSize) {
        const pool = await connectDB();

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("PageNumber", sql.Int, pageNumber)
            .input("PageSize", sql.Int, pageSize)
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
                c.Name AS CategoryName,
                i.ImageUrl AS MainImage
                FROM dbo.Products p
                JOIN dbo.ProductImages i on p.Id = i.ProductId AND i.IsMain = 1
                JOIN dbo.Teams t ON p.TeamId = t.Id
                JOIN dbo.Leagues l ON p.LeagueId = l.Id
                JOIN dbo.Categories c ON p.CategoryId = c.Id
                WHERE p.CategoryId = @CategoryId
                ORDER BY p.Id
                OFFSET (@PageNumber - 1) * @PageSize ROWS
                FETCH NEXT @PageSize ROWS ONLY
                `);

        return result.recordset;
    },

    async getProductsByLeague(leagueId, pageNumber, pageSize) {
        const pool = await connectDB();

        const result = await pool.request()
            .input('LeagueId', sql.Int, leagueId)
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize)
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
                    c.Name AS CategoryName,
                    i.ImageUrl AS MainImage
                    FROM dbo.Products p
                    JOIN dbo.ProductImages i ON p.Id = i.ProductId AND i.IsMain = 1
                    JOIN dbo.Teams t ON p.TeamId = t.Id
                    JOIN dbo.Leagues l ON p.LeagueId = l.Id
                    JOIN dbo.Categories c ON p.CategoryId = c.Id
                    WHERE p.LeagueId = @LeagueId
                    ORDER BY p.Id
                    OFFSET (@PageNumber - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY
                    `);

        return result.recordset;
    },

    async getProductsByTeam(teamId, pageNumber, pageSize) {
        const pool = await connectDB();

        const result = await pool.request()
            .input('TeamId', sql.Int, teamId)
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize)
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
                        c.Name AS CategoryName,
                        i.ImageUrl AS MainImage
                        FROM dbo.Products p
                        JOIN dbo.ProductImages i ON p.Id = i.ProductId AND i.IsMain = 1
                        JOIN dbo.Teams t ON p.TeamId = t.Id
                        JOIN dbo.Leagues l ON p.LeagueId = l.Id
                        JOIN dbo.Categories c ON p.CategoryId = c.Id
                        WHERE p.TeamId = @TeamId
                        ORDER BY p.Id
                        OFFSET (@PageNumber - 1) * @PageSize ROWS
                        FETCH NEXT @PageSize ROWS ONLY
                        `);

        return result.recordset;
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

        if (productResult.recordset.length > 0) {
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

    async createProduct(categoryId, leagueId, teamId, productName, description, price, images, sizes) {

        const pool = await connectDB();

        const productResult = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueId", sql.Int, leagueId)
            .input("TeamId", sql.Int, teamId)
            .input("Name", sql.NVarChar, productName)
            .input("Description", sql.NVarChar, description)
            .input("Price", sql.Decimal(10, 2), price)
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

        for (const size of sizes) {
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
            sizes
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
                        .input("Id", sql.Int, Number(img.id) ?? 0)
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

            // Adding or updating sizes
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
            await transaction.rollback();
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
            await transaction.rollback();
            throw err;
        }
    },

    async countProducts() {
        const pool = await connectDB();
        const result = await pool.request()
            .query(`SELECT COUNT(*) AS total FROM dbo.Products`)
        return result.recordset[0].total;
    },

    async countProductsFromOneCategory(categoryId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .query(`SELECT COUNT (*) AS total FROM dbo.Products
                    WHERE CategoryId = @CategoryId`)
        return result.recordset[0].total;
    },

    async countProductsFromOneLeague(leagueId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .query(`SELECT COUNT (*) AS total FROM dbo.Products
                    WHERE LeagueId = @LeagueId`)
        return result.recordset[0].total;
    },

    async countProductsFromOneTeam(teamId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("TeamId", sql.Int, teamId)
            .query(`SELECT COUNT (*) AS total FROM dbo.Products
                    WHERE TeamId = @TeamId`)
        return result.recordset[0].total;
    }

};

export default productService;