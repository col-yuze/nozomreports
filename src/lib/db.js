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
async function runUpdateQuery(query) {
  try {
    const result = await connection.execute(query);
    await connection.commit();
    console.log("Query ran");
    return result.rows; // Assuming you want to return the rows
  } catch (err) {
    await connection.rollback();
    console.log("Transaction rolled back due to error:", err);

    console.error("Error running the query:", err);
    throw err;
  }
}
async function runBoundedQuery(query, bounded_variable) {
  try {
    const result = await connection.execute(query, [bounded_variable]);
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
  runBoundedQuery,
  runUpdateQuery,
};
