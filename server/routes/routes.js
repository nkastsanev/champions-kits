import { Router } from 'express';
import userController from '../controllers/userController.js';
import adminController from '../controllers/adminController.js';

const router = Router();

router.use('/auth', userController);
router.use('/admin', adminController);


export default router;