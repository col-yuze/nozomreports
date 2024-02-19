import formatOracleDate from "@/lib/utils";

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
    const DEP_IN = req.query.dept;
    const DATE_IN = formatOracleDate(req.query.date);
    const query = `
    SELECT PRESCRIPTION.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL(PRESCRIPTION.PATIENT_NUM) PATIENT_NAME,PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,SUM(PRESCRIPTION_MEDICINE.REQUEST_QUANTITY) REQUEST_QUANTITY
FROM PRESCRIPTION,PRESCRIPTION_MEDICINE,MEDICINE_USED,PATIENT_GOING_IN_ROOM,ROOM
WHERE PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_FLAG = 0
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
AND     ROOM.DEPARTMENT_CODE = ${DEP_IN}
AND     PRESCRIPTION.PRESCRIPTION_TYPE = 4
AND     PRESCRIPTION.PRESCRIPTION_DATE = '${DATE_IN}'
GROUP BY PRESCRIPTION.PATIENT_NUM,PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A
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
