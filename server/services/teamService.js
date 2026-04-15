import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

export const teamService = {
    async getAll(categoryId = null, leagueId = null, page = 1, pageSize = 10) {
        const pool = await connectDB();

        const countResult = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueId", sql.Int, leagueId)
            .query(`
            SELECT COUNT(*) as total
            FROM dbo.Teams t
            JOIN dbo.Leagues l ON l.Id = t.LeagueId
            JOIN dbo.Categories c ON c.Id = l.CategoryId
            WHERE 
                (@CategoryId IS NULL OR c.Id = @CategoryId)
                AND (@LeagueId IS NULL OR l.Id = @LeagueId)
        `);

        const total = countResult.recordset[0].total;

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("LeagueId", sql.Int, leagueId)
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, pageSize)
            .query(`
            SELECT 
                t.Id as id,
                t.Name as name,
                t.LeagueId as leagueId,
                l.Name as leagueName,
                c.Id as categoryId,
                c.Name as categoryName,
                COUNT(p.Id) as productCount
            FROM dbo.Teams t
            JOIN dbo.Leagues l ON l.Id = t.LeagueId
            JOIN dbo.Categories c ON c.Id = l.CategoryId
            LEFT JOIN dbo.Products p ON p.TeamId = t.Id
            WHERE 
                (@CategoryId IS NULL OR c.Id = @CategoryId)
                AND (@LeagueId IS NULL OR l.Id = @LeagueId)
            GROUP BY 
                t.Id, t.Name, t.LeagueId, l.Name, c.Id, c.Name
            ORDER BY t.Id
            OFFSET (@Page - 1) * @PageSize ROWS
            FETCH NEXT @PageSize ROWS ONLY
        `);

        return {
            data: result.recordset,
            total
        };
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

    async update(id, leagueId, teamName) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("Id", sql.Int, id)
            .input("LeagueId", sql.Int, leagueId)
            .input("Name", sql.NVarChar, teamName)
            .query(`
            SELECT * FROM dbo.Teams
            WHERE Name = @Name AND LeagueId = @LeagueId AND Id != @Id
        `);

        if (check.recordset.length > 0) {
            throw new Error("Team with this name already exists in this league.");
        }

        const result = await pool.request()
            .input("Id", sql.Int, id)
            .input("LeagueId", sql.Int, leagueId)
            .input("Name", sql.NVarChar, teamName)
            .query(`
            UPDATE dbo.Teams
            SET Name = @Name, LeagueId = @LeagueId
            OUTPUT INSERTED.*
            WHERE Id = @Id
        `);

        if (result.recordset.length === 0) {
            throw new Error("Team not found!");
        }

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
