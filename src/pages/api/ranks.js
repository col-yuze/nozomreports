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
    const query = `
    SELECT  RANK_CODE, RAMK_NAME
    FROM HOSP.V_RANKS
    `;
    const result = await runQuery(query);
    const filtered_res = result.map((el) => `${el[0]}-${el[1]}`);
    filtered_res.unshift("0-الكل");

    res.status(200).json({ success: true, data: filtered_res });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
