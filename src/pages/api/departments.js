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
    const HOSP_IN = req.query.hospin;
    const query = `
    SELECT  d.DEPARTMENT_NAME, d.DEPARTMENT_CODE
    FROM DEPARTMENT d
    JOIN WARD w
    ON d.F_W_CODE = w.F_W_CODE
    WHERE  BUILDING_NUM = ${HOSP_IN}
    `;
    const result = await runQuery(query);
    console.log(result);
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
