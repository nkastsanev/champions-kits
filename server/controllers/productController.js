import { Router } from "express";
import productService from "../services/productService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const productController = Router();

// // All products
// productController.get("/page/:pageNum", async (req, res) => {

//     try {
//         const page = parseInt(req.params.pageNum) || 1;
//         const pageSize = 20;

//         const total = await productService.countProducts();
//         const products = await productService.getAllProducts(page, pageSize);

//         res.status(200).json({
//             products,
//             total,
//             page,
//             pageSize,
//             totalPages: Math.ceil(total / pageSize)
//         });
//     } catch (err) {
//         res.status(400).json({ message: "Erorr retrieving products." })
//     }

// });

// // All products from one category
// productController.get("/category/:categoryId/page/:pageNum", async (req, res) => {

//     try {
//         const categoryId = parseInt(req.params.categoryId);
//         const page = parseInt(req.params.pageNum) || 1;
//         const pageSize = 20;


//         const total = await productService.countProductsFromOneCategory(categoryId);
//         const products = await productService.getProductsByCategory(categoryId, page, pageSize);
//         res.status(200).json({
//             products,
//             total,
//             page,
//             pageSize,
//             totalPages: Math.ceil(total / pageSize)
//         });
//     } catch (err) {
//         res.status(400).json({ message: "Error retrieving products." })
//     }

// });

// // All products from one league
// productController.get("/league/:leagueId/page/:pageNum", async (req, res) => {

//     try {
//         const leagueId = parseInt(req.params.leagueId);
//         const page = parseInt(req.params.pageNum) || 1;
//         const pageSize = 20;

//         const total = await productService.countProductsFromOneLeague(leagueId);
//         const products = await productService.getProductsByLeague(leagueId, page, pageSize)
//         res.status(200).json({
//             products,
//             total,
//             page,
//             pageSize,
//             totalPages: Math.ceil(total / pageSize)
//         });
//     } catch (err) {
//         res.status(400).json({ message: "Error retrieving products." })
//     }

// });

// // All products from one team
// productController.get("/team/:teamId/page/:pageNum", async (req, res) => {

//     try {
//         const teamId = parseInt(req.params.teamId);
//         const page = parseInt(req.params.pageNum) || 1;
//         const pageSize = 20;

        
//         const total = await productService.countProductsFromOneTeam(teamId);
//         const products = await productService.getProductsByTeam(teamId, page, pageSize);

//         res.status(200).json({
//             products,
//             total,
//             page,
//             pageSize,
//             totalPages: Math.ceil(total / pageSize)
//         });
//     } catch (err) {
//         res.status(400).json({ message: "Error retrieving products." })
//     }

// });

productController.get("/", async (req, res) => {
    try {
        const {
            categoryId,
            leagueId,
            teamId,
            page = 1
        } = req.query;

        const pageSize = 20;

        const filters = {
            categoryId: categoryId ? parseInt(categoryId) : null,
            leagueId: leagueId ? parseInt(leagueId) : null,
            teamId: teamId ? parseInt(teamId) : null,
        };

        const total = await productService.countProducts(filters);
        const products = await productService.getProducts({
            ...filters,
            pageNumber: parseInt(page),
            pageSize
        });

        res.status(200).json({
            products,
            total,
            page: parseInt(page),
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        });

    } catch (err) {
        res.status(400).json({ message: "Error retrieving products." });
    }
});

// Getting product by id
productController.get("/:productId", async (req, res) => {

    const { productId } = req.params;

    try {
        const product = await productService.getProductById(productId);
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json( {message: 'Product not found.'} )
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

    const { productId } = req.params.id;
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

    const { productId } = req.params.id;

    try {
        await productService.deleteProduct(productId);
        res.status(200).json({ message: 'Product deleted successfully!'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

});

export default productController;
