import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const adminService = {

    async dashboardDetails() {

        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT
                    ISNULL(SUM(o.Subtotal), 0) AS totalRevenue,
                    COUNT(o.Id) AS completedOrders,
                    (SELECT COUNT(*) FROM Users) AS usersCount,
                    (SELECT COUNT(*) FROM Products) AS productsCount
                FROM Orders o
                WHERE o.OrderStatus = 'Completed'
                `)

        return result.recordset[0];
    },

    async productsDetails() {

        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM dbo.Products) AS totalProducts,

                    (SELECT COUNT(*) 
                     FROM dbo.Products p
                     WHERE NOT EXISTS (
                         SELECT 1 
                         FROM dbo.ProductSizes ps
                         WHERE ps.ProductId = p.Id
                           AND ps.Stock > 0
                     )
                    ) AS outOfStock,

                    (SELECT ISNULL(SUM(oi.Quantity), 0)
                     FROM dbo.OrderItems oi
                     INNER JOIN dbo.Orders o ON o.Id = oi.OrderId
                     WHERE o.OrderStatus IN ('Completed', 'Delivered')
                    ) AS totalSales;
                `)

        return result.recordset[0];

    },

    async ordersDetails() {

        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(*) AS totalOrders,
                    COUNT(CASE WHEN OrderStatus = 'Pending' THEN 1 END) AS pendingOrders,
                    COUNT(CASE WHEN OrderStatus = 'Processing' THEN 1 END) AS processingOrders,
                    COUNT(CASE WHEN OrderStatus = 'Delivered' THEN 1 END) AS deliveredOrders,
                    COUNT(CASE WHEN OrderStatus = 'Completed' THEN 1 END) AS completedOrders,
                    COUNT(CASE WHEN OrderStatus = 'Cancelled' THEN 1 END) AS cancelledOrders,
                    COUNT(CASE WHEN OrderStatus = 'Returned' THEN 1 END) AS returnedOrders
                FROM dbo.Orders;
                `)

        return result.recordset[0];

    },

    async usersDetails() {

        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(*) AS totalUsers,
                    SUM(CASE 
                        WHEN CreatedAt >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)
                             AND CreatedAt <= GETDATE()
                        THEN 1 ELSE 0 
                    END) AS newThisMonth
                FROM dbo.Users;
                `)

        return result.recordset[0];
    },


    async catalogDetails() {

        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                    SELECT 
                        (SELECT COUNT(*) FROM dbo.Categories) AS totalCategories,
                        (SELECT COUNT(*) FROM dbo.Leagues) AS totalLeagues,
                        (SELECT COUNT(*) FROM dbo.Teams) AS totalTeams,
                        (SELECT COUNT(*) FROM dbo.Products) AS totalProducts
                        `);

        return result.recordset[0];
    }

};

export default adminService;