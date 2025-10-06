import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const adminService = {
    async addCategory(categoryName) {

        const pool = await connectDB();

        const check = await pool.request()
            .input("CategoryName", sql.NVarChar, categoryName)
            .query("SELECT * FROM dbo.Categories WHERE Name = @CategoryName");

        if (check.recordset.length > 0) {
            throw new Error("Category with this name already exists!");
        }

        const result = await pool.request()
            .input("CategoryName", sql.NVarChar, categoryName)
            .query(`INSERT INTO dbo.Categories (Name)
            OUTPUT INSERTED.*
            VALUES (@CategoryName)`);

        return result.recordset[0];
    },

    async deleteCategory(categoryId) {

        const pool = await connectDB();

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .query(`DELETE FROM dbo.Categories
                OUTPUT DELETED.*
                WHERE Id = @CategoryId`
            );

        if (result.recordset.length === 0) {
            throw new Error("Category not found!");
        }

        return result.recordset[0];
    },

    async addLeague(categoryId, leagueName) {

        const pool = await connectDB();

        const check = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueName", sql.NVarChar, leagueName)
            .query(`
            SELECT * FROM dbo.Leagues 
            WHERE Name = @LeagueName AND CategoryId = @CategoryId
        `);

        if (check.recordset.length > 0) {
            throw new Error("League with this name already exists in this category!");
        }

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueName", sql.NVarChar, leagueName)
            .query(`INSERT INTO dbo.Leagues (CategoryId, Name)
            OUTPUT INSERTED.*
            VALUES (@CategoryId, @LeagueName)`);

        return result.recordset[0];
    },

    async deleteLeague(leagueId) {

        const pool = await connectDB();

        const result = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .query(`DELETE FROM dbo.Leagues
                OUTPUT DELETED.*
                WHERE Id = @LeagueId`
            );

        if (result.recordset.length === 0) {
            throw new Error("League not found!");
        }

        return result.recordset[0];
    },

    async addTeam(leagueId, teamName) {

        const pool = await connectDB();

        const check = await pool.request()
            .input("TeamName", sql.NVarChar, teamName)
            .input("LeagueId", sql.Int, leagueId)
            .query(`SELECT * FROM dbo.Teams 
                WHERE Name = @TeamName AND LeagueId = @LeagueId`);

        if (check.recordset.length > 0) {
            throw new Error("Team with this name already exists in this league!");
        }

        const result = await pool.request()
            .input("LeagueId", sql.Int, leagueId)
            .input("TeamName", sql.NVarChar, teamName)
            .query(`INSERT INTO dbo.Teams (LeagueId, Name)
                    OUTPUT INSERTED.*
                    VALUES (@LeagueId, @TeamName)
                    `);

        return result.recordset[0];
    },

    async deleteTeam(teamId) {

        const pool = await connectDB();

        const result = await pool.request()
            .input("TeamId", sql.Int, teamId)
            .query(`DELETE FROM dbo.Teams
                OUTPUT DELETED.*
                WHERE Id = @TeamId`);

        if (result.recordset.length === 0) {
            throw new Error('Team not found!');
        }

        return result.recordset[0];
    },

    async promoteToAdmin(userId) {

        const pool = await connectDB();

        const check = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`SELECT * FROM dbo.Users WHERE Id = @UserId`);

        if (check.recordset.length === 0) {
            throw new Error("User not found!");
        }

        const user = check.recordset[0];

        if (user.Role === 1){
            throw new Error("User is already an admin!")
        }

        const result = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`UPDATE dbo.Users 
                    SET Role = 1
                    OUTPUT INSERTED.*
                    WHERE Id = @UserId`);

        return result.recordset[0];
    }

};

export default adminService;