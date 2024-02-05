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
    const BU_IN = req.data.param1;
    const query = `
    SELECT BUILDING.BUILDING_NUM,BUILDING.BUILDING_NAME,PATIENT.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL( PATIENT.PATIENT_NUM) RANK_FULL_NAME,
            PATIENT_GOING_IN_ROOM.GOING_IN_DATE,PATIENT_GOING_IN_ROOM.GOING_IN_DATE,PATIENT_IN.IN_DATE,PATIENT_GOING_IN_ROOM.ROOM_NUM,ROOM.ROOM_NAME,DEPARTMENT.DEPARTMENT_CODE,DEPARTMENT.DEPARTMENT_NAME
FROM   PATIENT,PATIENT_IN,PATIENT_GOING_IN_ROOM,ROOM,WARD,BUILDING,ARRIVAL,DEPARTMENT
WHERE PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
AND     PATIENT.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT.PATIENT_NUM = ARRIVAL.PATIENT_NUM
AND     ROOM.DEPARTMENT_CODE = DEPARTMENT.DEPARTMENT_CODE
AND     PATIENT_IN.PRESENT_IN = 1
AND     PATIENT.PATIENT_NUM <> 0
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_TIME IS NULL
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     PATIENT_GOING_IN_ROOM.ARIVAL_SERIAL = PATIENT_IN.ARIVAL_SERIAL
AND     PATIENT_IN.ARIVAL_SERIAL = ARRIVAL.ARIVAL_SERIAL
AND     ROOM.F_W_CODE = WARD.F_W_CODE
AND     (BUILDING.BUILDING_NUM = ${BU_IN} OR ${BU_IN} = 0)
AND     WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
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
