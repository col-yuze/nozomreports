const {
  connectToDatabase,
  closeDatabaseConnection,
  runBoundedQuery,
} = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();
    const user_name = req.query.user_name
    // Your database queries or operations go here
    const query = `
      select user_password from users
      where user_name = :user_name
    `;
    // using a parameterized query to prevent sql injections
    const result = await runBoundedQuery(query, user_name);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
