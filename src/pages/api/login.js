const {
  connectToDatabase,
  closeDatabaseConnection,
  runBoundedQuery,
} = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();
    const user_name = req.query.username;
    const pass = req.query.pass;
    // Your database queries or operations go here
    console.log(user_name,pass)
    const query = `
      select u.user_name, u.user_desc,g.group_name,g.group_code from users u
      join groups g
      on g.group_code = u.group_code 
      where user_name = :user_name and user_password = :pass
    `;
    // using a parameterized query to prevent sql injections
    const result = await runBoundedQuery(query, [user_name,pass]);
    res.status(200).json({ success: true,data:result[0] });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
