import { Router } from "express";
import orderService from "../services/orderService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

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

orderController.get("/page/:pageNum", authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const page = parseInt(req.params.pageNum) || 1;
        const pageSize = 20;

        const total = await orderService.countOrders();
        const orders = await orderService.getAllOrders(page, pageSize)

        res.status(200).json({
            orders,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (err) {
        res.status(400).json({ message: `Error retrieving orders.` })
    }

});

orderController.get("/my", authMiddleware, async (req, res) => {

    try {
        const userId = req.user.id;

        const orders = await orderService.gerOrdersByUser(userId);

        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

orderController.get("/user/:userId", authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const userId = Number(req.params.userId);

        const orders = await orderService.gerOrdersByUser(userId);
        
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json( {message: err.message })
    }

});

orderController.get("/:orderId", authMiddleware, async (req, res) => {

    try {
        const orderId = Number(req.params.orderId);

        const order = await orderService.getOrderById(orderId);

        const isAdmin = req.user.isAdmin;
        const isOwner = order.order.UserId === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

orderController.put("/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const orderId = Number(req.params.orderId);
        const { status } = req.body;


        const updatedOrder = await orderService.updateOrderStatus(orderId, status);

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Failed to update order!" })
    }

});

orderController.put("/:orderId/paid", authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const orderId = Number(req.params.orderId);

        await orderService.markOrderAsPaid(orderId);

        res.status(204).json({ message: 'The order was marked as paid!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});


export default orderController;