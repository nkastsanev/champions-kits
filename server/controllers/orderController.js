import { Router } from "express";
import orderService from "../services/orderService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const orderController = Router();

orderController.post("/", async (req, res) => {
        try {
            const userId = req.user?.id ?? null;

            const { cart, ...orderData } = req.body;

            const order = await orderService.createOrder(
                userId,
                cart,
                orderData
            );

            res.status(201).json(order);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
});

orderController.get("/:orderId", authMiddleware, async (req, res) => {
        try {
            const orderId = req.params;

            const order = await orderService.getOrderById(orderId);

            res.status(200).json(order);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
});


export default orderController;