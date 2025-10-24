import { Router } from "express";
import { teamService } from "../services/teamService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const teamController = Router();

teamController.get('/', async (req, res) => {

    try {
        const teams = await teamService.getAll();
        res.status(200).json(teams);
    } catch (err) {
         res.status(400).json({message: "Error retrieving teams."});
    }

});

teamController.post('/', authMiddleware, adminMiddleware, async (req, res) => {

    const {leagueId, teamName} = req.body;


    try {
        const team = await teamService.create(leagueId, teamName);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});

teamController.get('/league/:leagueId', async (req, res) => {

    const leagueId = req.params.leagueId;

    try {
        const teams = await teamService.getByLeague(leagueId);
        res.status(200).json(teams);
    } catch (err) {
        res.status(400).json({message: "Error retrieving teams."});
    }

});

teamController.delete('/:teamId', async (req, res) => {

    const teamId = req.params.teamId;

    try {
        await teamService.delete(teamId);
        res.status(200).json("Team delete successfully.");
    } catch (err) {
        res.status(500).json({message: err.message});
    }

});

export default teamController;
