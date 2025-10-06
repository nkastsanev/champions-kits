import { Router } from "express";
import productService from "../services/productService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const productController = Router();

// All products
productController.get("/page/:pageNum", async (req, res) => {

    try {
        const page = parseInt(req.params.pageNum) || 1;
        const pageSize = 20;

        const products = await productService.getAllProducts(page, pageSize);
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: "Erorr retrieving products." })
    }

});

// All products from one category
productController.get("/category/:categoryId/page/:pageNum", async (req, res) => {

    try {
        const categoryId = parseInt(req.params.categoryId);
        const page = parseInt(req.params.pageNum) || 1;
        const pageSize = 20;

        const products = await productService.getProductsByCategory(categoryId, page, pageSize);
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving products." })
    }

});

// All products from one league
productController.get("/league/:leagueId/page/:pageNum", async (req, res) => {

    try {
        const leagueId = parseInt(req.params.leagueId);
        const page = parseInt(req.params.pageNum) || 1;
        const pageSize = 20;

        const products = await productService.getProductsByLeague(leagueId, page, pageSize)
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving products." })
    }

});

// All products from one team
productController.get("/team/:teamId/page/:pageNum", async (req, res) => {

    try {
        const teamId = parseInt(req.params.teamId);
        const page = parseInt(req.params.pageNum) || 1;
        const pageSize = 20;

        const products = await productService.getProductsByTeam(teamId, page, pageSize);
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving products." })
    }

});

// Creating product
productController.post("/", authMiddleware, adminMiddleware, async (req, res) => {

    const { categoryId, leagueId, teamId, productName, description, price, images, sizes } = req.body;

    try {
        const product = await productService.createProduct(
            categoryId,
            leagueId,
            teamId,
            productName,
            description,
            price,
            images,
            sizes);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

// Updating product
productController.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    const productId = req.params.id;
    const {categoryId, leagueId, teamId, productName, description, price, images, sizes} = req.body;

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
        res.status(500).json({message: "Failed to update product!"})
    }


});

// Deleting product

productController.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    const productId = req.params.id;

    try {
        await productService.deleteProduct(productId);
        res.status(200).json({ message: 'Product deleted successfully!'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

});
