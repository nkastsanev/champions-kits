import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

export const teamService = {
    async getAll() {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM dbo.Teams");
        return result.recordset;
    },

    async getByLeague(leagueId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .query(`SELECT FROM dbo.Teams WHERE LeagueId = @LeagueId`);
        return result.recordset;
    },

    async create(leagueId, teamName) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .input("Name", sql.NVarChar, teamName)
            .query(`SELECT * FROM dbo.Teams
                    WHERE Name = @Name AND LeagueId = @LeagueId`);

        if (check.recordset.length > 0) {
            throw new Error("A team with this name already exists in this league.")
        }

        const result = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .input("Name", sql.NVarChar, teamName)
            .query(`INSERT INTO dbo.Teams (LeagueId, Name)
                    OUTPUT INSERTED.*
                    VALUES (@LeagueId, @Name)`);

        return result.recordset[0];
    },

    async delete(teamId) {
        const pool = await connectDB();

        const result = await pool.request()
            .input("Id", sql.Int, teamId)
            .query(`DELETE FROM dbo.Teams
                    OUTPUT DELETED.*
                    WHERE Id = @Id`);

        if (result.recordset.length === 0) {
            throw new Error("Team not found!");
        }

        return result.recordset[0];
    }
};
