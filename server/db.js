import sql from "mssql/msnodesqlv8.js";

const config = {
  connectionString:
    "Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=ChampionsKits;Trusted_Connection=Yes;"
};

export async function connectDB() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("DB Connection Failed:");
    console.error(JSON.stringify(err, null, 2));
    throw err;
  }
}