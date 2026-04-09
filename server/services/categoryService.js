import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";
import { mapCategory, mapCategoryWithStats } from "../mappers/categoryMapper.js";

export const categoryService = {
    async getAll() {
        const pool = await connectDB();
        const result = await pool.request().query(`
        SELECT 
            c.Id as id, 
            c.Name as name,
            (SELECT COUNT(*) FROM dbo.Leagues l WHERE l.CategoryId = c.Id) as leagues,
            (SELECT COUNT(*) FROM dbo.Teams t 
                JOIN dbo.Leagues l ON t.LeagueId = l.Id 
                WHERE l.CategoryId = c.Id) as teams,
            (SELECT COUNT(*) FROM dbo.Products p 
                JOIN dbo.Teams t ON p.TeamId = t.Id
                JOIN dbo.Leagues l ON t.LeagueId = l.Id
                WHERE l.CategoryId = c.Id) as products
        FROM dbo.Categories c
    `);
        return result.recordset.map(mapCategoryWithStats);
    },

    async getAllSimple() {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT Id as id, Name as name
            FROM dbo.Categories
            ORDER BY Name
        `);

        return result.recordset.map(mapCategory);
    },

    async getCategoryById(id) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query("SELECT * FROM dbo.Categories WHERE Id = @Id");

        return mapCategory(result.recordset[0]);
    },

    async create(name) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("Name", sql.NVarChar, name)
            .query(`
                    SELECT * FROM dbo.Categories
                    WHERE Name = @Name
                    `)

        if (check.recordset.length > 0) {
            throw new Error("Category with this name already exists!");
        }

        const result = await pool.request()
            .input("Name", sql.NVarChar, name)
            .query(`INSERT INTO dbo.Categories (Name)
                    OUTPUT INSERTED.*
                    VALUES (@Name)`)

        return mapCategory(result.recordset[0]);
    },

    async update(id, name) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("Name", sql.NVarChar, name)
            .input("Id", sql.Int, id)
            .query("SELECT * FROM dbo.Categories WHERE Name = @Name AND Id != @Id");

        if (check.recordset.length > 0) {
            throw new Error("Another category with this name already exists!");
        }

        const result = await pool.request()
            .input("Id", sql.Int, id)
            .input("Name", sql.NVarChar, name)
            .query(`
            UPDATE dbo.Categories 
            SET Name = @Name 
            OUTPUT INSERTED.*
            WHERE Id = @Id
        `);

        if (result.recordset.length === 0) {
            throw new Error("Category not found!");
        }

        return mapCategoryWithStats(result.recordset[0]);
    },

    async delete(id) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query(`DELETE FROM dbo.Categories
                    OUTPUT DELETED.*
                    WHERE Id = @Id`);

        if (result.recordset.length === 0) {
            throw new Error("Category not found!")
        }

        return mapCategory(result.recordset[0]);
    }


}