const oracledb = require("oracledb");
//enable thick mode for pwd
oracledb.initOracleClient();
const dbConfig = {
  user: "HOSPUSER",
  password: "hosp",
  connectString: "128.16.7.5:1521/hosp1121", // Replace with the actual connection details
};

async function connectToDatabase() {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to the database");

    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

async function closeDatabaseConnection(connection) {
  try {
    await connection.close();
    console.log("Closed the database connection");
  } catch (err) {
    console.error("Error closing the database connection:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
};
