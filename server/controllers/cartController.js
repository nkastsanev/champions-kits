import { Router } from "express";
import { cartService } from "../services/cartService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const cartController = Router();

cartController.post('/', authMiddleware, async (req, res) => {

    const userId = req.user.id;
    const {productId, sizeId, quantity } = req.body;

    try {
        const item = await cartService.addToCart(userId, productId, sizeId, quantity);
        res.status(201).json(item)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

cartController.get('/', authMiddleware, async (req, res) => {

    const userId = req.user.id;

    try {
        const result = await cartService.getCartItems(userId);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

cartController.put('/product/:productId', authMiddleware, async (req, res) => {

    const userId = req.user.id;
    const productId = req.params.productId;
    const {sizeId, quantity} = req.body;

    try {
        const item = await cartService.updateCartItem(userId, productId, sizeId, quantity);
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

cartController.delete('/product/:cartItemId', authMiddleware, async (req, res) => {

    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;

    try {
        const item = await cartService.removeCartItem(userId, cartItemId);
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({message: err.message})
    }

});

cartController.delete('/', authMiddleware, async (req, res) => {

    const userId = req.user.id;

    try {
        const items = await cartService.clearCart(userId);
        res.status(200).json(items)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

export default cartController;