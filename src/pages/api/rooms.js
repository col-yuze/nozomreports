const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DEPT_IN = req.query.deptin;
    const query = `
    SELECT  ROOM_NAME, ROOM_NUM
    FROM ROOM
    WHERE  ROOM.DEPARTMENT_CODE = ${DEPT_IN}
    `;
      const result = await runQuery(query);
      console.log(result)
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
