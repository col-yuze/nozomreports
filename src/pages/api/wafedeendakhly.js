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
    SELECT PATIENT.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL( PATIENT.PATIENT_NUM) RANK_FULL_NAME,PATIENT_GOING_IN_ROOM.GOING_IN_DATE,PATIENT_GOING_IN_ROOM.GOING_OUT_DATE,PATIENT_GOING_IN_ROOM.ROOM_NUM
FROM   PATIENT,PERSON,PATIENT_IN,PATIENT_GOING_IN_ROOM
WHERE PATIENT.ID_CODE = PERSON.ID_CODE
AND     PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
AND    PATIENT_IN.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND    PERSON.PERSON_ADJECTIVE IN (3,4)
AND    PATIENT_GOING_IN_ROOM.GOING_IN_DATE >= '${FROM_DATE}'
AND    PATIENT_GOING_IN_ROOM.GOING_IN_DATE  <= '${TO_DATE}'
ORDER BY GOING_IN_DATE DESC
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
