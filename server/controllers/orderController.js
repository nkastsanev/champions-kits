import orderService from "../services/orderService.js";

const orderController = {

    async createOrder(req, res) {
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
    }
};

export default orderController;