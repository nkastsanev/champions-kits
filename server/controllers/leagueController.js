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

leagueController.post('/', authMiddleware, adminMiddleware, async (req, res) => {

    const {categoryId, name} = req.body;

    try {
        const league = await leagueService.create(categoryId, name);
        res.status(201).json(league);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

leagueController.put('/:leagueId', authMiddleware, adminMiddleware, async (req, res) => {
    const id = req.params.leagueId;
    const { name, categoryId } = req.body;

    try {
        const updatedLeague = await leagueService.update(id, name, categoryId);
        res.status(200).json(updatedLeague);
    } catch (err) {
        res.status(400).json({ message: err.message });
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