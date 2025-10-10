import sql from "mssql/msnodesqlv8.js";
import { connectDB } from "../db.js";

const adminService = {
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