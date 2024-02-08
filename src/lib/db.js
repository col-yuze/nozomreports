const oracledb = require("oracledb");
// enable thick mode for pwd
oracledb.initOracleClient();
const dbConfig = {
  user: "HOSPUSER",
  password: "hosp",
  connectString: "128.16.7.5:1521/hosp1121", // Replace with the actual connection details
};

let connection; // Declare the connection at the module level

async function connectToDatabase() {
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to the database");

    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

async function closeDatabaseConnection() {
  try {
    await connection.close();
    console.log("Closed the database connection");
  } catch (err) {
    console.error("Error closing the database connection:", err);
    throw err;
  }
}

async function runQuery(query) {
  try {
    const result = await connection.execute(query);
    console.log("Query ran");
    return result.rows; // Assuming you want to return the rows
  } catch (err) {
    console.error("Error running the query:", err);
    throw err;
  }
}
async function runTransaction(queries) {
  try {
    // here excute a transaction
    // search for commit, batch and transaction and run the queries array returning results as array
    const result = await connection.execute(queries);
    console.log("Query ran");
    return result.rows; // Assuming you want to return the rows
  } catch (err) {
    console.error("Error running the query:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
};
