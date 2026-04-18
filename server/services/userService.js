import sql from "mssql/msnodesqlv8.js";
import bcrypt from "bcrypt";
import { connectDB } from "../db.js";
import jwt from "jsonwebtoken";
import { mapUser } from "../mappers/userMapper.js";

// Функцията за ръчно създаване на собственик
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
    .input("Role", sql.TinyInt, 2)
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

    const safeUser = mapUser(userData);

    return { user: safeUser, token };
  },

  async getAllUsers(search = null, role = null, page = 1, pageSize = 10) {
    const pool = await connectDB();

    const result = await pool.request()
      .input("Search", sql.NVarChar, search)
      .input("Role", sql.Int, role)
      .input("Page", sql.Int, page)
      .input("PageSize", sql.Int, pageSize)
      .query(`
      SELECT 
            u.Id as id,
            u.FirstName as firstName,
            u.LastName as lastName,
            u.Email as email,
            u.Role as role,
            u.CreatedAt as createdAt,

            (
              SELECT COUNT(*) 
              FROM dbo.Orders o 
              WHERE o.UserId = u.Id
            ) as ordersCount,

            (
              SELECT ISNULL(SUM(o.TotalPrice), 0)
              FROM dbo.Orders o 
              WHERE o.UserId = u.Id
            ) as totalSpent,


            (
              SELECT MAX(o.CreatedAt)
              FROM dbo.Orders o 
              WHERE o.UserId = u.Id
            ) as lastOrder,

            COUNT(*) OVER() as totalCount

      FROM dbo.Users u
      LEFT JOIN dbo.Orders o ON o.UserId = u.Id

      WHERE 
    (@Search IS NULL OR 
      u.FirstName LIKE @Search + '%' OR 
      u.LastName LIKE @Search + '%' OR 
      u.Email LIKE @Search + '%')
    AND (@Role IS NULL OR u.Role = @Role)

      GROUP BY 
        u.Id, u.FirstName, u.LastName, u.Email, u.Role, u.CreatedAt

      ORDER BY u.Id

      OFFSET (@Page - 1) * @PageSize ROWS
      FETCH NEXT @PageSize ROWS ONLY
    `);

    return {
      data: result.recordset,
      total: result.recordset[0]?.totalCount || 0
    };
  },

  async changeRole(requestingUser, targetUserId, newRole) {
    const pool = await connectDB();

    const requesterRole = requestingUser.role;

    const target = await pool.request()
      .input("Id", sql.Int, targetUserId)
      .query("SELECT Role FROM dbo.Users WHERE Id = @Id");

    const targetRole = target.recordset[0]?.Role;

    if (!targetRole && targetRole !== 0) {
      throw new Error("User not found");
    }

    if (requesterRole === 1 && targetRole !== 0) {
      throw new Error("Admins can only modify Users");
    }

    if (requesterRole === 1 && newRole !== 1) {
      throw new Error("Admins can only promote users to Admin");
    }

    if (targetRole === 2 && requesterRole !== 2) {
      throw new Error("Cannot modify Owner");
    }

    await pool.request()
      .input("Id", sql.Int, targetUserId)
      .input("Role", sql.TinyInt, newRole)
      .query(`
      UPDATE dbo.Users
      SET Role = @Role
      WHERE Id = @Id
    `);
  },

  async getUserById(userId) {
    const pool = await connectDB();

    const result = await pool.request()
      .input("Id", sql.Int, userId)
      .query(`SELECT Id, FirstName, LastName, Email, Role, BonusPoints, CreatedAt, UpdatedAt 
            FROM dbo.Users WHERE Id = @Id`);

    return result.recordset[0];
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
