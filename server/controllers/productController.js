import { Router } from "express";
import productService from "../services/productService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const productController = Router();

productController.get('/', async (req, res) => {

    try {

        const {
            categoryId,
            leagueId,
            teamId,
            search,
            page = 1,
            pageSize = 10,
        } = req.query;

        const filters = {
            categoryId: categoryId ? parseInt(categoryId) : null,
            leagueId: leagueId ? parseInt(leagueId) : null,
            teamId: teamId ? parseInt(teamId) : null,
            search: search || null,
        };

        const total = await productService.countProducts(filters);

        const products = await productService.getProducts({
            ...filters,
            pageNumber: parseInt(page),
            pageSize: parseInt(pageSize),
        });

        res.status(200).json({
            products,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(total / pageSize),
        });

    } catch (err) {
        res.status(400).json({
            message: 'Error retrieving products.'
        });
    }
});

productController.get("/sizes", authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const sizes = await productService.getProductSizes();
        res.status(200).json(sizes)
    } catch (err) {
        res.status(400).json({ message: 'Failed to get the sizes' })
    }

});

productController.get("/:productId", async (req, res) => {

    const { productId } = req.params;

    try {
        const product = await productService.getProductById(productId);
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Product not found.' })
    }

});

productController.post("/", authMiddleware, adminMiddleware, async (req, res) => {

    const { categoryId, leagueId, teamId, productName, description, price, images, productSizes } = req.body;

    try {
        const product = await productService.createProduct(
            categoryId,
            leagueId,
            teamId,
            productName,
            price,
            description,
            images,
            productSizes);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

productController.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    const { id: productId } = req.params;
    const { categoryId, leagueId, teamId, productName, description, price, images, sizes } = req.body;

    try {
        const product = await productService.updateProduct(
            productId,
            categoryId,
            leagueId,
            teamId,
            productName,
            description,
            price,
            images,
            sizes);
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ message: "Failed to update product!" })
    }


});

productController.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    const { id: productId } = req.params;

    try {
        await productService.deleteProduct(productId);
        res.status(200).json({ message: 'Product deleted successfully!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});

export default productController;
