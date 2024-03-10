import { formatOracleDate } from "@/lib/utils";

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
    const DATE_IN = formatOracleDate(req.query.datein);
    const CNT_IN = req.query.countin;
    const query = `
      SELECT COUNT(*),CNT
      FROM   (SELECT PATIENT_NUM,COUNT(*) CNT
                  FROM   PRESCRIPTION_MEDICINE_MON
                  WHERE  EXISTS (SELECT 1
                      FROM    PRESCRIPTION
                      WHERE  PRESCRIPTION.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                      AND      PRESCRIPTION_TYPE IN (3,8)
                      AND      (PRESCRIPTION.PRESCRIPTION_DATE >= '${DATE_IN}' OR '${DATE_IN}' IS NULL))
                  HAVING COUNT(*) > ${CNT_IN}
                  GROUP BY PATIENT_NUM) PP
      GROUP BY CNT
      ORDER BY 2 DESC
    `;
    const result = await runQuery(query);

    // filter out 1,2,3 columns and add index
    const filtered_res = result.map((el, i) => [
      i + 1,
      el[0],
      el[1],
      el[0] * el[1],
    ]);
    // reduce to a single array with all the values sum
    const sum = filtered_res.reduce((acc, row) => {
      row.forEach((el, i) => {
        acc[i] = (acc[i] || 0) + el;
      });
      // add this row to the end of the array
      // filtered_res.push(acc);
      return acc;
    }, []);
    sum[0] = "الاجمالي";
    filtered_res.push(sum);
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
