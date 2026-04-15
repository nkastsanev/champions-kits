import { Router } from "express";
import { teamService } from "../services/teamService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const teamController = Router();

teamController.get('/', async (req, res) => {
    const { categoryId, leagueId, page = 1, pageSize = 10 } = req.query;

    try {
        const teams = await teamService.getAll(
            categoryId || null,
            leagueId || null,
            Number(page),
            Number(pageSize)
        );

        res.status(200).json(teams);
    } catch (err) {
        res.status(400).json({ message: "Error retrieving teams." });
    }
});

teamController.post('/', authMiddleware, adminMiddleware, async (req, res) => {

    const { leagueId, teamName } = req.body;


    try {
        const team = await teamService.create(leagueId, teamName);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

teamController.put('/:teamId', authMiddleware, adminMiddleware, async (req, res) => {
    const teamId = req.params.teamId;
    const { leagueId, teamName } = req.body;

    try {
        const updated = await teamService.update(teamId, leagueId, teamName);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

teamController.delete('/:teamId', async (req, res) => {

    const teamId = req.params.teamId;

    try {
        await teamService.delete(teamId);
        res.status(200).json("Team delete successfully.");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

export default teamController;
