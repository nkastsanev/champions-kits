import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

export const categoryService = {
    async getAll() {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM dbo.Categories");
        return result.recordset;
    },

    async create(categoryName) {
        const pool = await connectDB();

        const check = await pool.request()
                .input("Name", sql.NVarChar, categoryName)
                .query(`
                    SELECT * FROM dbo.Categories
                    WHERE Name = @Name
                    `)

        if (check.recordset.length > 0) {
            throw new Error("Category with this name already exists!");
        }

        const result = await pool.request()
            .input("Name", sql.NVarChar, categoryName)
            .query(`INSERT INTO dbo.Categories (Name)
                    OUTPUT INSERTED.*
                    VALUES (@Name)`)
        
        return result.recordset[0];
    },

    async delete(id) {
        const pool = await connectDB();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query(`DELETE FROM dbo.Categories
                    OUTPUT DELETED.*
                    WHERE Id = @Id`);

        if (result.recordset.length === 0){
            throw new Error("Category not found!")
        }

        return result.recordset[0];
    }


}