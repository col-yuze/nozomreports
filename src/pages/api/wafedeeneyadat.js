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
    const FROM_DATE = formatOracleDate(req.query.fdate);
    const TO_DATE = formatOracleDate(req.query.tdate);
    const query = `
    SELECT PATIENT.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL( PATIENT.PATIENT_NUM) RANK_FULL_NAME,RESERVE_CLINIC.RESERVE_DATE,RESERVE_CLINIC.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME
FROM   PATIENT,PERSON,RESERVE_CLINIC,V_CLINIC_NAME
WHERE PATIENT.ID_CODE = PERSON.ID_CODE
AND     PATIENT.PATIENT_NUM = RESERVE_CLINIC.PATIENT_NUM
AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
AND    PERSON.PERSON_ADJECTIVE IN (3,4)
AND    RESERVE_CLINIC.RESERVE_DATE >= '${FROM_DATE}'
AND    RESERVE_CLINIC.RESERVE_DATE <= '${TO_DATE}'
ORDER BY RESERVE_DATE DESC
    `;
    const result = await runQuery(query);
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
