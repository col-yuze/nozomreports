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
    const query = `
    SELECT  SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A,COUNT(DISTINCT PRESCRIPTION_MEDICINE_MON.PATIENT_NUM) CNT
    FROM PRESCRIPTION_MEDICINE_MON,CLINIC,SPECIALISIM
    WHERE PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC.CLINIC_CODE
    AND    CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE
    AND     CLINIC.SPECIALISIM_CODE NOT IN (8,9,13,18,52,53,54)
    AND    EXISTS (SELECT 1
                      FROM    PRESCRIPTION
                      WHERE PRESCRIPTION.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                      AND     PRESCRIPTION.PRESCRIPTION_TYPE IN (3,8)
                      AND     PRESCRIPTION_DATE >= '${DATE_IN}')
    GROUP BY SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A
    ORDER BY 1
    `;
    const result = await runQuery(query);
    const filtered_res = result.map((el, i) => [i + 1, el[1], el[2]]);
    filtered_res.unshift(["م", "التخصص", "عدد المرضى"]);

    // Calculate the sum of values 
    const sumOfColumn = filtered_res
      .slice(1)
      .reduce((acc, curr) => acc + curr[2], 0);

    // Add a row to the table for displaying the sum
    const sumRow = ["", "الاجمالي", sumOfColumn];
    filtered_res.push(sumRow);

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
