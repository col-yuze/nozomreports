import formatOracleDate from "@/lib/utils";
// const {
//   connectToDatabase,
//   closeDatabaseConnection,
//   runQuery,
// } = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    // connection = await connectToDatabase();

    // Retrieve parameters from query
    const Options = req.query.Options;
    const D1 = formatOracleDate(req.query.StartDate); //req.data.param1;
    const D2 = formatOracleDate(req.query.EndDate); //req.data.param2;
    console.log(D1, D2, Options, "filo");

    // // Your database queries or operations go here
    // const query = `
    // SELECT WARD.BUILDING_NUM,BUILDING.BUILDING_NAME,WARD.F_W_CODE,WARD.F_W_NAME,
    //         SUM(CASE WHEN PATIENT.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) THEN 1 ELSE 0 END) DOBAT,
    //         SUM(CASE WHEN PATIENT.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) THEN 1 ELSE 0 END) SAF,
    //         SUM(CASE WHEN PATIENT.RANK IN (20,21) AND  PATIENT.KINSHIP_PATIENT_NUM IS NULL THEN 1 ELSE 0 END) MADANY,
    //         SUM(CASE WHEN PATIENT.RANK IN (20,21) AND  P2.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22)  THEN 1 ELSE 0 END) DOBAT_F,
    //         SUM(CASE WHEN PATIENT.RANK IN (20,21) AND  P2.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23)  THEN 1 ELSE 0 END) SAF_F,
    //         COUNT(*) CNT
    // FROM   PATIENT,PERSON,PATIENT_IN,PATIENT_GOING_IN_ROOM,ROOM,WARD,BUILDING,PATIENT P2
    // WHERE PATIENT.ID_CODE = PERSON.ID_CODE
    // AND     PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
    // AND    PATIENT_IN.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
    // AND    PATIENT_IN.ARIVAL_SERIAL = PATIENT_GOING_IN_ROOM.ARIVAL_SERIAL
    // AND    PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
    // AND    ROOM.F_W_CODE = WARD.F_W_CODE
    // AND    PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
    // AND    WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
    // AND    (WARD.BUILDING_NUM = ${Options} OR ${Options} = 0)
    // --AND    PATIENT_GOING_IN_ROOM.GOING_OUT_DATE  > PATIENT_GOING_IN_ROOM.GOING_IN_DATE
    // AND    PATIENT_GOING_IN_ROOM.GOING_IN_DATE >=  '${D1}'
    // AND    PATIENT_GOING_IN_ROOM.GOING_IN_DATE  <= '${D2}'
    // GROUP BY WARD.BUILDING_NUM,BUILDING.BUILDING_NAME,WARD.F_W_CODE,WARD.F_W_NAME
    // ORDER BY WARD.F_W_CODE
    // `;
    // const result = await runQuery(query);
    // res.status(200).json({ success: true, data: result });
    res.status(200);
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      // await closeDatabaseConnection(connection);
    }
  }
}
