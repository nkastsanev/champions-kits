import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

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
            .input("OrderStatus", sql.NVarChar, "new")
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

    }
    
};


export default orderService;