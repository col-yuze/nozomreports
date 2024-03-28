const {
  connectToDatabase,
  closeDatabaseConnection,
  runUpdateQuery,
} = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const count = req.query.count;
    const clinic_code = req.query.code;
    const type = req.query.type; // type 1 means add // 2 means sub // 3 means reset
    console.log(count, clinic_code, type);
    let query = `
    `;
    if (type == 1 || type == 2) {
      //increment query
      query = `
          UPDATE CLINIC
          SET CO_P_NUM = ${count}
          WHERE CLINIC.CLINIC_CODE = ${clinic_code}
      `;
      console.log("increment");
    } else if (type == 3) {
      // reset query
       query = `
          UPDATE CLINIC
          SET CO_P_NUM = 0
      `;
      console.log("reset");
    }
    const result = await runUpdateQuery(query);
    console.log(result)
    // filter out 1,2,3 columns and add index
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
