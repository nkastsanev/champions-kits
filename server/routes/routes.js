import { Router } from 'express';
import userController from '../controllers/userController.js';
import adminController from '../controllers/adminController.js';
import productController from '../controllers/productController.js';
import categoryController from "../controllers/categoryController.js"
import leagueController from '../controllers/leagueController.js';
import teamController from '../controllers/teamController.js'
import cartController from '../controllers/cartController.js';

const router = Router();

router.use('/auth', userController);
router.use('/admin', adminController);
router.use('/products', productController);
router.use('/categories', categoryController);
router.use('/leagues', leagueController);
router.use('/teams', teamController);
router.use('/cart', cartController);


export default router;