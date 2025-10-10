import { Router } from 'express';
import adminService from '../services/adminService.js';
import authMiddleware from '../middlewares/authMiddleware.js'
import adminMiddleware from '../middlewares/adminMiddleware.js';

const adminController = Router();


adminController.put('/promote-to-admin', authMiddleware, adminMiddleware, async (req, res) => {

    const {userId} = req.body;

    try {
        const updatedUser = await adminService.promoteToAdmin(userId);
        res.status(200).json({message: `${updatedUser.FirstName} ${updatedUser.LastName} promoted to Admin!`})
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

export default adminController;
