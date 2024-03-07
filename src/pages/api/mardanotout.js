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
    SELECT PATIENT.RANK,PATIENT.PATIENT_NUM,ROOM.ROOM_NUM,BUILDING.BUILDING_NUM,PATIENT_GOING_IN_ROOM.GOING_IN_DATE
FROM   PATIENT,PATIENT_IN,PATIENT_GOING_IN_ROOM,ROOM,WARD,BUILDING--,PATIENT P2
WHERE PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
AND     PATIENT.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_IN.PRESENT_IN = 1
AND     PATIENT.PATIENT_NUM <> 0
--AND     PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_TIME IS NULL
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     PATIENT_GOING_IN_ROOM.GOING_IN_DATE < '${DATE_IN}'
AND     ROOM.F_W_CODE = WARD.F_W_CODE
AND     WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
ORDER BY BUILDING.BUILDING_NUM
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
