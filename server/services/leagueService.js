import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

export const leagueService = {
    async getAll() {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM dbo.Leagues");
        return result.recordset;
    },

    async getByCategory(categoryId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .query("SELECT * FROM dbo.Leagues WHERE CategoryId = @CategoryId");
        return result.recordset;
    },

    async create(categoryId, leagueName) {
        const pool = await connectDB();

        const check = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("Name", sql.NVarChar, leagueName)
            .query(`SELECT * FROM dbo.Leagues 
                    WHERE Name = @Name AND CategoryId = @CategoryId`);

        if (check.recordset.length > 0) {
            throw new Error("League already exists in this category!");
        }

        const result = await pool.request()
            .input("CategoryId", sql.Int, categoryId)
            .input("Name", sql.NVarChar, leagueName)
            .query(`INSERT INTO dbo.Leagues (CategoryId, Name) 
                OUTPUT INSERTED.* 
                VALUES (@CategoryId, @Name)`);

        return result.recordset[0];
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

        return result.recordset[0];
    }
};