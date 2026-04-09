import { Router } from "express";
import { categoryService } from "../services/categoryService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const categoryController = Router();

categoryController.get('/', async (req, res) => {

    try {
        const categories = await categoryService.getAll();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving categories." });
    }

});

categoryController.get('/simple', async (req, res) => {
    try {
        const categories = await categoryService.getAllSimple();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving simple categories." });
    }
});

categoryController.post('/', authMiddleware, adminMiddleware, async (req, res) => {

    const { name } = req.body;

    try {
        const category = await categoryService.create(name);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


categoryController.put('/:categoryId', authMiddleware, adminMiddleware, async (req, res) => {
    const id = req.params.categoryId;
    const { name } = req.body;

    try {
        const updatedCategory = await categoryService.update(id, name);
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

categoryController.delete('/:categoryId', authMiddleware, adminMiddleware, async (req, res) => {

    const categoryId = req.params.categoryId;

    try {
        await categoryService.delete(categoryId);
        res.status(200).json("Category deleted successfully.")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});

export default categoryController;