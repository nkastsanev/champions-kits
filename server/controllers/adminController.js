import { Router } from 'express';
import adminService from '../services/adminService.js';
import authMiddleware from '../middlewares/authMiddleware.js'
import adminMiddleware from '../middlewares/adminMiddleware.js';

const adminController = Router();


adminController.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const dashboardDetails = await adminService.dashboardDetails();
        res.status(200).json(dashboardDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

adminController.get('/products', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const productsDetails = await adminService.productsDetails();
        res.status(200).json(productsDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

adminController.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const ordersDetails = await adminService.ordersDetails();
        res.status(200).json(ordersDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

adminController.get('/users', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const usersDetails = await adminService.usersDetails();
        res.status(200).json(usersDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

adminController.get('/catalog', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const catalogDetails = await adminService.catalogDetails();
        res.status(200).json(catalogDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

export default adminController;
