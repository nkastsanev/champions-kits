import { Router } from 'express';
import adminService from '../services/adminService.js';
import authMiddleware from '../middlewares/authMiddleware.js'
import adminMiddleware from '../middlewares/adminMiddleware.js';

const adminController = Router();

adminController.post('/add-category', authMiddleware, adminMiddleware, async (req, res) => {
    
    const { categoryName } = req.body;

    try {
        const category = await adminService.addCategory(categoryName);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

adminController.delete('/delete-category/:id', authMiddleware, adminMiddleware, async (req, res) => {
    
    const categoryId = Number(req.params.id);

    try {
        const deletedCategory = await adminService.deleteCategory(categoryId);
        res.status(200).json({message: "Category deleted successfully!", category: deletedCategory})
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

adminController.post('/add-league', authMiddleware, adminMiddleware, async (req, res) => {
    
    const {categoryId, leagueName} = req.body;

    try {
        const league = await adminService.addLeague(categoryId, leagueName);
        res.status(201).json(league);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

adminController.delete('/delete-league/:id', authMiddleware, adminMiddleware, async (req, res) => {

    const leagueId = Number(req.params.id);

    try {
        const deletedLeague = await adminService.deleteLeague(leagueId);
        res.status(200).json({message: "League deleted successfully!", league: deletedLeague})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

adminController.post('/add-team', authMiddleware, adminMiddleware, async (req, res) => {

    const {leagueId, teamName} = req.body;

    try {
        const team = await adminService.addTeam(leagueId, teamName);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

adminController.delete('/delete-team/:id', authMiddleware, adminMiddleware, async (req, res) => {

    const teamId = Number(req.params.id);

    try {
        const deletedTeam = await adminService.deleteTeam(teamId);
        res.status(200).json({message: "Team deleted successfully!", team: deletedTeam})
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

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
