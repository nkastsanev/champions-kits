import { Router } from "express";
import { leagueService } from "../services/leagueService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const leagueController = Router();

leagueController.get('/', async (req, res) => {

    try {
        const leagues = await leagueService.getAll();
        res.status(200).json(leagues);
    } catch (err) {
        res.status(400).json({message: "Error retrieving leagues."});
    }

});

leagueController.get('/category/:categoryId', async (req, res) => {

    const categoryId = req.params.categoryId

    try {
        const leagues = await leagueService.getByCategory(categoryId);
        res.status(200).json(leagues);
    } catch (err) {
        res.status(400).json({message: "Error retrieving leagues."});
    }

});

leagueController.post('/', authMiddleware, adminMiddleware, async (req, res) => {

    const {categoryId, leagueName} = req.body;

    try {
        const league = await leagueService.create(categoryId, leagueName);
        res.status(201).json(league);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

leagueController.delete('/:leagueId', authMiddleware, adminMiddleware, async (req, res) => {

    const leagueId = req.params.leagueId;

    try {
        await leagueService.delete(leagueId);
        res.status(200).json("League delete successfully.");
    } catch (err) {
        res.status(500).json({message: err.message});
    }

});

export default leagueController;