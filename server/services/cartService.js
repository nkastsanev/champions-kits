import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";
import { use } from "react";

const cartService = {

    async addToCart(userId, productId, sizeId, quantity) {
        const pool = await connectDB();

        const stockCheck = await pool.request()
            .input("ProductId", sql.Int, productId)
            .input("SizeId", sql.Int, sizeId)
            .query(`
            SELECT Stock FROM dbo.ProductSizes
            WHERE ProductId = @ProductId AND SizeId = @SizeId
        `);

        if (stockCheck.recordset.length === 0) {
            throw new Error("Invalid size or product combination!");
        }

        const stock = stockCheck.recordset[0].Stock;
        if (stock < quantity) {
            throw new Error("Not enough stock available for this size!");
        }

        const check = await pool.request()
            .input("UserId", sql.Int, userId)
            .input("ProductId", sql.Int, productId)
            .input("SizeId", sql.Int, sizeId)
            .query(`
            SELECT * FROM dbo.CartItems
            WHERE UserId = @UserId AND ProductId = @ProductId AND SizeId = @SizeId
        `);

        if (check.recordset.length > 0) {
            const currentQty = check.recordset[0].Quantity;

            if (currentQty + quantity > stock) {
                throw new Error("Not enough stock to increase quantity!");
            }

            const updated = await pool.request()
                .input("UserId", sql.Int, userId)
                .input("ProductId", sql.Int, productId)
                .input("SizeId", sql.Int, sizeId)
                .input("Quantity", sql.Int, quantity)
                .query(`
                UPDATE dbo.CartItems
                SET Quantity = Quantity + @Quantity
                OUTPUT INSERTED.*
                WHERE UserId = @UserId AND ProductId = @ProductId AND SizeId = @SizeId
            `);

            return updated.recordset[0];
        }

        const productResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .input("ProductId", sql.Int, productId)
            .input("SizeId", sql.Int, sizeId)
            .input("Quantity", sql.Int, quantity)
            .query(`
            INSERT INTO dbo.CartItems (UserId, ProductId, SizeId, Quantity)
            OUTPUT INSERTED.*
            VALUES (@UserId, @ProductId, @SizeId, @Quantity)
        `);

        return productResult.recordset[0];
    },

    async getCartItems(userId) {

        const pool = await connectDB();

        // If the cart item quantity is bigger than the stock in the squad - equal it

        await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`UPDATE ci
                    SET ci.Quantity = ps.Stock
                    FROM dbo.CartItems ci
                    JOIN dbo.ProductSizes ps
                        ON ci.ProductId = ps.ProductId
                        AND ci.SizeId = ps.SizeId
                    WHERE ci.UserId = @UserId
                        AND ci.Quantity > ps.Stock
                `);

        // If the cart item is no longer available - then remove it from there

        await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`DELETE ci
                        FROM dbo.CartItems ci
                        LEFT JOIN dbo.ProductSizes ps
                            ON ci.ProductId = ps.ProductId
                            AND ci.SizeId = ps.SizeId
                        WHERE ci.UserId = @UserId
                            AND ps.Stock = 0
                        `);

        const cart = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`SELECT 
                  ci.Id AS CartItemId,
                  ci.ProductId,
                  p.Name AS ProductName,
                  p.Price,,
                  s.Name AS SizeName,
                  ci.Quantity,
                  ps.Stock AS AvailableStock,
                  (p.Price * ci.Quantity) AS TotalPrice,
                  i.ImageUrl AS MainImage
                FROM dbo.CartItems ci
                JOIN dbo.Products p ON ci.ProductId = p.Id
                JOIN dbo.Sizes s ON ci.SizeId = s.Id
                JOIN dbo.ProductSizes ps ON ci.ProductId = ps.ProductId AND ci.SizeId = ps.SizeId
                LEFT JOIN dbo.ProductImages i ON i.ProductId = p.Id AND i.IsMain = 1
                WHERE ci.UserId = @UserId
                ORDER BY ci.Id DESC;
    `);

        return cart.recordset;
    },

    async updateCartItem(userId, productId, sizeId, quantity) {

        if (quantity <= 0) {
            throw new Error('Quantity must be positive number!')
        }

        const pool = await connectDB();

        const stockCheck = await pool.request()
            .input("ProductId", sql.Int, productId)
            .input("SizeId", sql.Int, sizeId)
            .query(`SELECT Stock FROM dbo.ProductSizes
                        WHERE ProductId = @ProductId AND SizeId = @SizeId
                    `)

        const availableStock = stockCheck.recordset[0]?.Stock ?? 0;

        if (quantity > availableStock) {
            throw new Error('Not enough stock available for the selected product.');
        }

        const updatedCartItem = await pool.request()
            .input("UserId", sql.Int, userId)
            .input("ProductId", sql.Int, productId)
            .input("SizeId", sql.Int, sizeId)
            .input("Quantity", sql.Int, quantity)
            .query(`UPDATE dbo.CartItems
                        SET Quantity = @Quantity
                        OUTPUT INSERTED.*
                        WHERE UserId = @UserId AND ProductId = @ProductId AND SizeId = @SizeId
                    `)

        if (updatedCartItem.recordset.length === 0) {
            throw new Error('Cart item not found.');
        }

        return updatedCartItem.recordset[0];
    },

    async removeCartItem(userId, cartItemId) {

        const pool = await connectDB();

        const deleteCartItem = await pool.request()
            .input("UserId", sql.Int, userId)
            .input("Id", sql.Int, cartItemId)
            .query(`DELETE FROM dbo.CartItems
                    OUTPUT DELETED.*
                    WHERE Id = @Id AND UserId = @UserId`)

        if (deleteCartItem.recordset.length === 0) {
            throw new Error('Cart item not found.')
        }

        return deleteCartItem.recordset[0];
    },

    async clearCart(userId) {

        const pool = await connectDB();

        const clearing = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`DELETE FROM dbo.CartItems
                    OUTPUT DELETED.*
                    WHERE UserId = @UserId`)

        if (clearing.recordset.length === 0) {
            throw new Error('No products found in the cart to be deleted.')
        }

        return clearing.recordset;
    },

    async getCartTotalPrice(userId) {
        const pool = await connectDB();

        const totalPriceResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`
            SELECT 
                SUM(ci.Quantity * p.Price) AS TotalPrice
            FROM dbo.CartItems AS ci
            JOIN dbo.Products AS p
                ON ci.ProductId = p.Id
            WHERE ci.UserId = @UserId
        `);

        const total = totalPriceResult.recordset[0].TotalPrice || 0;

        return total;
    }
}

export default cartService;