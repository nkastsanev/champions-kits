import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const allowedOrderTransitions = {
    pending: ["processing", "cancelled"],

    processing: ["delivered", "cancelled"],

    delivered: ["completed"],

    completed: ["returned"],

    returned: [],

    cancelled: []
};

const orderService = {

    async createOrder(userId, cart, orderData) {
        const pool = await connectDB();

        const {
            firstName,
            lastName,
            email,
            phone,

            deliveryType,
            city,
            address,
            postalCode,
            officeId,
            officeName,

            paymentMethod,
            usedBonusPoints,
            discountCode,
        } = orderData;

        let deliveryPrice = 0;

        if (!firstName || !lastName || !email || !phone)
            throw new Error("Missing customer information.");

        if (!deliveryType || !["home", "office"].includes(deliveryType))
            throw new Error("Invalid delivery type.");

        if (!city)
            throw new Error("City is required.");

        if (deliveryType === "home") {
            deliveryPrice = 5;
            if (!address) throw new Error("Address is required for home delivery.");
            if (!postalCode) throw new Error("Postal code is required.");
        }

        if (deliveryType === "office") {
            deliveryPrice = 8;
            if (!officeId) throw new Error("Office ID is required.");
            if (!officeName) throw new Error("Office name is required.");
        }

        if (!paymentMethod || !["cash", "card"].includes(paymentMethod))
            throw new Error("Invalid payment method.");

        let items = [];

        if (userId) {
            const dbCart = await pool.request()
                .input("UserId", sql.Int, userId)
                .query(`
                SELECT ci.ProductId, ci.SizeId, ci.Quantity, p.Price
                FROM dbo.CartItems ci
                JOIN dbo.Products p ON ci.ProductId = p.Id
                WHERE ci.UserId = @UserId
            `);

            items = dbCart.recordset;
        } else if (Array.isArray(cart) && cart.length > 0) {
            items = cart;

            for (const item of items) {
                const p = await pool.request()
                    .input("Id", sql.Int, item.productId)
                    .query(`SELECT Price FROM dbo.Products WHERE Id = @Id`);

                item.Price = p.recordset[0].Price;
            }
        } else {
            throw new Error("Cart is empty.");
        }

        for (const item of items) {
            const stockCheck = await pool.request()
                .input("ProductId", sql.Int, item.ProductId || item.productId)
                .input("SizeId", sql.Int, item.SizeId || item.sizeId)
                .query(`
                SELECT Stock FROM dbo.ProductSizes
                WHERE ProductId = @ProductId AND SizeId = @SizeId
            `);

            const stock = stockCheck.recordset[0]?.Stock ?? 0;
            const qty = item.Quantity || item.quantity;

            if (qty > stock) {
                throw new Error("Not enough stock for one of the products.");
            }
        }

        let subtotal = 0;

        for (const item of items) {
            const qty = item.Quantity || item.quantity;
            subtotal += item.Price * qty;
        }

        let bonusDiscount = 0;

        if (userId && usedBonusPoints > 0) {
            const userData = await pool.request()
                .input("UserId", sql.Int, userId)
                .query(`SELECT BonusPoints FROM dbo.Users WHERE Id = @UserId`);

            const currentPoints = userData.recordset[0].BonusPoints;

            if (usedBonusPoints > currentPoints) {
                throw new Error("You don't have enough bonus points.");
            }

            bonusDiscount = usedBonusPoints / 10; // 10 points = 1 lv
        }


        // Here we can add promo codes
        const promoDiscount = 0;
        const discountAmount = promoDiscount + bonusDiscount;

        let total = subtotal - discountAmount;
        if (total < 0) total = 0;

        if (subtotal >= 200) {
            deliveryPrice = 0;
        }

        total += deliveryPrice;

        const orderResult = await pool.request()
            .input("UserId", userId ?? null)
            .input("FirstName", sql.NVarChar, firstName)
            .input("LastName", sql.NVarChar, lastName)
            .input("Email", sql.NVarChar, email)
            .input("Phone", sql.NVarChar, phone)

            .input("DeliveryType", sql.NVarChar, deliveryType)
            .input("City", sql.NVarChar, city)
            .input("Address", sql.NVarChar, address ?? null)
            .input("PostalCode", sql.NVarChar, postalCode ?? null)
            .input("OfficeId", sql.NVarChar, officeId ?? null)
            .input("OfficeName", sql.NVarChar, officeName ?? null)

            .input("PaymentMethod", sql.NVarChar, paymentMethod)
            .input("PaymentStatus", sql.NVarChar, paymentMethod === "card" ? "pending" : "unpaid")
            .input("PaymentReference", sql.NVarChar, null)
            .input("UsedBonusPoints", sql.Int, usedBonusPoints ?? 0)
            .input("DiscountCode", sql.NVarChar, discountCode ?? null)
            .input("OrderStatus", sql.NVarChar, "pending")
            .input("Subtotal", sql.Decimal(10, 2), subtotal)
            .input("DeliveryPrice", sql.Decimal(10, 2), deliveryPrice)
            .input("DiscountAmount", sql.Decimal(10, 2), discountAmount)
            .input("TotalPrice", sql.Decimal(10, 2), total)

            .query(`
            INSERT INTO dbo.Orders (
                UserId, FirstName, LastName, Email, Phone,
                DeliveryType, City, Address, PostalCode, OfficeId, OfficeName,
                PaymentMethod, PaymentStatus, PaymentReference, UsedBonusPoints, DiscountCode,
                OrderStatus, Subtotal, DeliveryPrice, DiscountAmount, TotalPrice
            )
            OUTPUT INSERTED.*
            VALUES (
                @UserId, @FirstName, @LastName, @Email, @Phone,
                @DeliveryType, @City, @Address, @PostalCode, @OfficeId, @OfficeName,
                @PaymentMethod, @PaymentStatus, @PaymentReference, @UsedBonusPoints, @DiscountCode,
                @OrderStatus, @Subtotal, @DeliveryPrice, @DiscountAmount, @TotalPrice
            )
        `);

        const order = orderResult.recordset[0];
        const orderId = order.Id;

        for (const item of items) {
            const pid = item.ProductId || item.productId;
            const sid = item.SizeId || item.sizeId;
            const qty = item.Quantity || item.quantity;

            await pool.request()
                .input("OrderId", sql.Int, orderId)
                .input("ProductId", sql.Int, pid)
                .input("SizeId", sql.Int, sid)
                .input("Quantity", sql.Int, qty)
                .input("PriceAtPurchase", sql.Decimal(10, 2), item.Price)
                .query(`
                INSERT INTO dbo.OrderItems (OrderId, ProductId, SizeId, Quantity, PriceAtPurchase)
                VALUES (@OrderId, @ProductId, @SizeId, @Quantity, @PriceAtPurchase)
            `);

            await pool.request()
                .input("ProductId", sql.Int, pid)
                .input("SizeId", sql.Int, sid)
                .input("Qty", sql.Int, qty)
                .query(`
                UPDATE dbo.ProductSizes
                SET Stock = Stock - @Qty
                WHERE ProductId = @ProductId AND SizeId = @SizeId
            `);
        }

        if (userId) {
            await pool.request()
                .input("UserId", sql.Int, userId)
                .query(`DELETE FROM dbo.CartItems WHERE UserId = @UserId`);
        }

        return order;
    },

    async getOrderById(orderId) {

        const pool = await connectDB();

        const orderResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .query(`SELECT * FROM dbo.Orders
                WHERE Id = @OrderId`)

        if (orderResult.recordset.length === 0) {
            throw new Error('Order not found!')
        }

        const order = orderResult.recordset[0];

        const orderItemsResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .query(`SELECT * FROM dbo.OrderItems
                WHERE OrderId = @OrderId`);

        let orderItems = orderItemsResult.recordset;

        return { order, orderItems }

    },

    async gerOrdersByUser(userId) {

        const pool = await connectDB();

        const ordersResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`SELECT * FROM dbo.Orders
                WHERE UserId = @UserId`);

        const orders = ordersResult.recordset;

        if (orders.length === 0) {
            return [];
        }

        for (const order of orders) {
            const orderItemsResult = await pool.request()
                .input("OrderId", sql.Int, order.Id)
                .query(`
                    SELECT 
                        oi.*,
                        p.Name AS ProductName,
                        p.Price AS ProductPrice,
                        pi.ImageUrl
                    FROM dbo.OrderItems oi
                    JOIN dbo.Products p ON p.Id = oi.ProductId
                    LEFT JOIN dbo.ProductImages pi 
                           ON pi.ProductId = oi.ProductId 
                          AND pi.isMain = 1
                    WHERE oi.OrderId = @OrderId
        `);

            order.items = orderItemsResult.recordset;
        }

        return orders;

    },

    async getAllOrders(pageNumber, pageSize) {

        const pool = await connectDB();

        const result = await pool.request()
            .input("PageNumber", sql.Int, pageNumber)
            .input("PageSize", sql.Int, pageSize)
            .query(`SELECT 
                    Id,
                    Email,
                    City,
                    PaymentMethod,
                    PaymentStatus,
                    TotalPrice,
                    OrderStatus,
                    CreatedAt
                    FROM dbo.Orders
                    ORDER BY CreatedAt DESC
                    OFFSET (@PageNumber - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY`)

        return result.recordset;
    },

    async updateOrderStatus(orderId, newStatus) {

        if (!newStatus || typeof newStatus !== "string") {
            throw new Error("Invalid order status");
        }

        const pool = await connectDB();

        const orderResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .query(`SELECT * FROM dbo.Orders
                    WHERE Id = @OrderId`)

        if (orderResult.recordset.length === 0) {
            throw new Error('Order not found!')
        }

        const order = orderResult.recordset[0];
        const prevStatus = order.OrderStatus;

        const allowed = allowedOrderTransitions[prevStatus] || [];

        if (newStatus === "delivered" && order.PaymentMethod === "card" && order.PaymentStatus !== "paid") {
            throw new Error("The order cannot be delivered, because it's unpaid")
        }

        if (!allowed.includes(newStatus)) {
            throw new Error(`Status: '${newStatus}' is not allowed from '${prevStatus}'`)
        }

        if (newStatus === "cancelled" || newStatus === "returned") {
            await this.restoreStockForOrder(orderId)

            if (order.UserId) {
                await this.refundPointsIfNeeded(order)
            }

        }

        if (newStatus === "completed" && order.PaymentStatus === "paid" && order.UserId) {
            await this.addBonusPoints(order);
        }

        const updatedOrderResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .input("OrderStatus", sql.NVarChar, newStatus)
            .query(`UPDATE dbo.Orders
                    SET OrderStatus = @OrderStatus
                    OUTPUT INSERTED.*
                    WHERE Id = @OrderId`)

        const updatedOrder = updatedOrderResult.recordset[0]

        return updatedOrder;
    },

    async restoreStockForOrder(orderId) {
        const pool = await connectDB();

        const itemsResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .query(`SELECT * FROM dbo.OrderItems
                    WHERE OrderId = @OrderId`)

        const items = itemsResult.recordset;

        for (const item of items) {
            await pool.request()
                .input("ProductId", sql.Int, item.ProductId)
                .input("SizeId", sql.Int, item.SizeId)
                .input("Qty", sql.Int, item.Quantity)
                .query(`UPDATE dbo.ProductSizes
                            SET Stock = Stock + @Qty
                            WHERE ProductId = @ProductId AND SizeId = @SizeId`)
        }
    },

    async refundPointsIfNeeded(order) {
        if (!order.UserId) return;

        const earnedPoints = Math.floor(order.TotalPrice / 10);

        const pool = await connectDB();

        await pool.request()
            .input("UserId", sql.Int, order.UserId)
            .input("Points", sql.Int, earnedPoints)
            .query(`UPDATE dbo.Users
                    SET BonusPoints = BonusPoints - @Points
                    WHERE Id = @UserId`);
    },

    async addBonusPoints(order) {

        const points = Math.floor(order.TotalPrice / 10);

        const pool = await connectDB();

        await pool.request()
            .input("UserId", sql.Int, order.UserId)
            .input("Points", sql.Int, points)
            .query(`UPDATE dbo.Users
                    SET BonusPoints = BonusPoints + @Points
                    WHERE Id = @UserId`)
    },

    async markOrderAsPaid(orderId) {

        const pool = await connectDB();

        const orderResult = await pool.request()
            .input("OrderId", sql.Int, orderId)
            .query(`SELECT * FROM dbo.Orders
                    WHERE Id = @OrderId`);

        const order = orderResult.recordset[0];

        if (!order) {
            throw new Error("Order not found!")
        }

        if (order.PaymentStatus === `paid`) {
            throw new Error("The order is already paid!")
        }



        if (order.PaymentMethod === `card` && order.PaymentStatus === `pending`) {
            await pool.request()
                .input("OrderId", sql.Int, orderId)
                .query(`UPDATE dbo.Orders
                        SET PaymentStatus = 'paid', PaymentReference = 'MOCK_PAYMENT'
                        WHERE Id = @OrderId`);
        }
    },

    async countOrders() {
        const pool = await connectDB();
        const result = await pool.request()
            .query(`SELECT COUNT(*) AS total FROM dbo.Orders`);
        return result.recordset[0].total;
    }

};


export default orderService;