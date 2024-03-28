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
    const pass = req.query.pass
    let access=false
    // Your database queries or operations go here

    // only the admin user can open this
    const query = `
      select user_password from users
      where user_name = :user_name
      and user_type =1
      and user_name = 'admin'
    `;
    // using a parameterized query to prevent sql injections
    const result = await runBoundedQuery(query, user_name);
    if (result[0][0] === pass) {
      access = true
      console.log(result)
    }
    res.status(200).json({ success: true, data: access });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
