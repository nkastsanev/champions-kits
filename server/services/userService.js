import sql from "mssql/msnodesqlv8.js";
import bcrypt from "bcrypt";
import { connectDB } from "../db.js";
import jwt from "jsonwebtoken";

// Функцията за ръчно създаване на админ
export async function createAdmin({ firstName, lastName, email, password }) {
  const pool = await connectDB();

  const check = await pool.request()
    .input("Email", sql.NVarChar, email)
    .query("SELECT * FROM dbo.Users WHERE Email = @Email");

  if (check.recordset.length > 0) {
    throw new Error("Admin with this email already exists!");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.request()
    .input("FirstName", sql.NVarChar, firstName)
    .input("LastName", sql.NVarChar, lastName)
    .input("Email", sql.NVarChar, email)
    .input("PasswordHash", sql.NVarChar, passwordHash)
    .input("Role", sql.TinyInt, 1)
    .query(`
      INSERT INTO dbo.Users (FirstName, LastName, Email, PasswordHash, Role)
      OUTPUT INSERTED.*
      VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role)
    `);

  return result.recordset[0];
}

const userService = {
  async register(firstName, lastName, email, password) {
    const pool = await connectDB();

    const check = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM dbo.Users WHERE Email = @Email");

    if (check.recordset.length > 0) {
      throw new Error("User with this email already exists!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.request()
      .input("FirstName", sql.NVarChar, firstName)
      .input("LastName", sql.NVarChar, lastName)
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, passwordHash)
      .input("Role", sql.TinyInt, 0)
      .input("BonusPoints", sql.Int, 0)
      .query(`
        INSERT INTO dbo.Users (FirstName, LastName, Email, PasswordHash, Role, BonusPoints)
        OUTPUT INSERTED.*
        VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role, @BonusPoints)
      `);

    return result.recordset[0];
  },

  async login(email, password) {
    const pool = await connectDB();
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

    const result = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM dbo.Users WHERE Email = @Email");

    const userData = result.recordset[0];

    if (!userData) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, userData.PasswordHash);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { id: userData.Id, role: userData.Role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { PasswordHash, ...safeUser } = userData;

    return { user: safeUser, token };
  },

  async getUserById(userId) {
    const pool = await connectDB();

    const result = await pool.request()
      .input("Id", sql.Int, userId)
      .query(`SELECT Id, FirstName, LastName, Email, Role, BonusPoints, CreatedAt, UpdatedAt 
            FROM dbo.Users WHERE Id = @Id`);

    return result.recordset[0];
  },

  async getAllUsers() {
    const pool = await connectDB();
    const result = await pool.request()
      .query("SELECT Id, FirstName, LastName, Email, Role, BonusPoints, CreatedAt, UpdatedAt FROM dbo.Users");
    return result.recordset;
  },

  async changePassword(userId, oldPassword, newPassword) {
    const pool = await connectDB();

    const result = await pool.request()
      .input("Id", sql.Int, userId)
      .query(`SELECT * FROM dbo.Users 
            WHERE Id = @Id`);

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(oldPassword, user.PasswordHash);

    if (!user || !isMatch) {
      throw new Error("Invalid credentials!");
    }

    const newHashedPass = await bcrypt.hash(newPassword, 10);

    await pool.request()
      .input("Id", sql.Int, userId)
      .input("PasswordHash", sql.NVarChar, newHashedPass)
      .query(`UPDATE dbo.Users SET PasswordHash = @PasswordHash WHERE Id = @Id`);

    return { message: "Password updated successfully!" }
  }
};

export default userService;
