import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";
import { mapLeague, mapLeagueWithStats } from "../mappers/leagueMapper.js";

export const leagueService = {
    async getAll(categoryId = null) {
        const pool = await connectDB();

        const query = `
        SELECT 
            l.Id as id,
            l.Name as name,
            c.Id as categoryId,
            c.Name as categoryName,
            COUNT(DISTINCT t.Id) as teams,
            COUNT(DISTINCT p.Id) as products
        FROM dbo.Leagues l
        JOIN dbo.Categories c ON c.Id = l.CategoryId
        LEFT JOIN dbo.Teams t ON t.LeagueId = l.Id
        LEFT JOIN dbo.Products p ON p.TeamId = t.Id
        WHERE (@CategoryId IS NULL OR l.CategoryId = @CategoryId)
        GROUP BY l.Id, l.Name, c.Id, c.Name
        ORDER BY l.Id
    `;

        const request = pool.request()
            .input("CategoryId", sql.Int, categoryId);

        const result = await request.query(query);

        return result.recordset.map(mapLeagueWithStats);
    },

    async create(categoryId, name) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("Name", sql.NVarChar, name)
            .query(`SELECT * FROM dbo.Leagues 
                    WHERE Name = @Name AND CategoryId = @CategoryId`);

        if (check.recordset.length > 0) {
            throw new Error("League already exists in this category!");
        }

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("Name", sql.NVarChar, name)
            .query(`INSERT INTO dbo.Leagues (CategoryId, Name) 
                OUTPUT INSERTED.* 
                VALUES (@CategoryId, @Name)`);

        return mapLeague(result.recordset[0]);
    },

    async update(id, name, categoryId) {
            const pool = await connectDB();
    
            const check = await pool.request()
                .input("Name", sql.NVarChar, name)
                .input("Id", sql.Int, id)
                .input("CategoryId", sql.Int, categoryId)
                .query("SELECT * FROM dbo.Leagues WHERE Name = @Name AND CategoryId = @CategoryId AND Id != @Id");
    
            if (check.recordset.length > 0) {
                throw new Error("Another category with this name already exists!");
            }
    
            const result = await pool.request()
                .input("Id", sql.Int, id)
                .input("Name", sql.NVarChar, name)
                .input("CategoryId", sql.Int, categoryId)
                .query(`
                UPDATE dbo.Leagues 
                SET Name = @Name, CategoryId = @CategoryId
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `);
    
            if (result.recordset.length === 0) {
                throw new Error("Category not found!");
            }
    
            return mapLeagueWithStats(result.recordset[0]);
        },

    async delete(leagueId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("Id", sql.Int, leagueId)
            .query(`DELETE FROM dbo.Leagues 
                    OUTPUT DELETED.* 
                    WHERE Id = @Id`);

        if (result.recordset.length === 0) {
            throw new Error("League not found!");
        }

        return mapLeague(result.recordset[0]);
    }
};