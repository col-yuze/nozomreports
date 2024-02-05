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

    const query =
      // general query
      `SELECT 
              BUILDING.BUILDING_NUM,
            -- sum the following again or add it outside in a with clause
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 1
                        AND ROOM_TYPE = 1
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) +
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 1
                        AND ROOM_TYPE = 2
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) +
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 0
                        AND ROOM_TYPE = 1
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) +
                  NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 0
                        AND ROOM_TYPE = 2
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) AS TOTAL_SUM,
                    --
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 1
                        AND ROOM_TYPE = 1
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) AS BED_STORE1_CNT,
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 1
                        AND ROOM_TYPE = 2
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) AS BED_STORE2_CNT,
                    NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 0
                        AND ROOM_TYPE = 1
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) AS BED_WRK1_CNT,
                  NVL(
                      (SELECT SUM(NVL(ROOM.BED_COUNT, 0))
                      FROM ROOM, WARD
                      WHERE ROOM.F_W_CODE = WARD.F_W_CODE
                        AND ROOM_CASE = 0
                        AND ROOM_TYPE = 2
                        AND WARD.BUILDING_NUM = BUILDING.BUILDING_NUM),
                      0
                    ) AS BED_WRK2_CNT,
                    
                    SUM(CASE WHEN PATIENT.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) AND ROOM.ROOM_TYPE = 1 THEN 1 ELSE 0 END) DOBAT_1, 
                    SUM(CASE WHEN PATIENT.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) AND ROOM.ROOM_TYPE = 2 THEN 1 ELSE 0 END) DOBAT_2, 
                    SUM(CASE WHEN PATIENT.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) AND ROOM.ROOM_TYPE = 1 THEN 1 ELSE 0 END) SAF1,
                    SUM(CASE WHEN PATIENT.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) AND ROOM.ROOM_TYPE = 2 THEN 1 ELSE 0 END) SAF2,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 1 AND PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL AND P2.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22)THEN 1 ELSE 0 END) DOBAT_F1,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 2 AND PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL AND P2.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22)THEN 1 ELSE 0 END) DOBAT_F2,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 1 AND PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL AND P2.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23)THEN 1 ELSE 0 END) SAF_F1,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 2 AND PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL AND P2.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23)THEN 1 ELSE 0 END) SAF_F2,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 1 AND PATIENT.KINSHIP_PATIENT_NUM IS NULL THEN 1 ELSE 0 END) MADNY1,
                    SUM(CASE WHEN PATIENT.RANK = 20 AND ROOM.ROOM_TYPE = 2 AND PATIENT.KINSHIP_PATIENT_NUM IS NULL THEN 1 ELSE 0 END) MADNY2,
                    SUM(CASE WHEN EXISTS (SELECT 1 FROM ASSOCIATION_IN_ROOM WHERE PATIENT_GOING_IN_ROOM.PATIENT_NUM = ASSOCIATION_IN_ROOM.PATIENT_NUM) AND ROOM.ROOM_TYPE = 1 THEN 1 ELSE 0 END) MORAFK1,
                    SUM(CASE WHEN EXISTS (SELECT 1 FROM ASSOCIATION_IN_ROOM WHERE PATIENT_GOING_IN_ROOM.PATIENT_NUM = ASSOCIATION_IN_ROOM.PATIENT_NUM) AND ROOM.ROOM_TYPE = 2 THEN 1 ELSE 0 END) MORAFK2,
                    COUNT(*) BEDS_CNT
                    FROM   PATIENT,PATIENT_IN,PATIENT_GOING_IN_ROOM,ROOM,WARD,BUILDING,ARRIVAL,PATIENT P2
        WHERE PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
        AND     PATIENT.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
        AND     PATIENT.PATIENT_NUM = ARRIVAL.PATIENT_NUM
        AND     PATIENT_IN.PRESENT_IN = 1
        AND     PATIENT.PATIENT_NUM <> 0
        AND     PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
        AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
        AND     PATIENT_GOING_IN_ROOM.GOING_OUT_TIME IS NULL
        AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
        AND     ROOM.F_W_CODE = WARD.F_W_CODE
        AND     PATIENT_GOING_IN_ROOM.ARIVAL_SERIAL = PATIENT_IN.ARIVAL_SERIAL
        AND     PATIENT_IN.ARIVAL_SERIAL = ARRIVAL.ARIVAL_SERIAL
        AND     WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
        GROUP BY BUILDING.BUILDING_NUM,BUILDING.BUILDING_NAME
        UNION
        SELECT BUILDING.BUILDING_NUM,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        FROM   BUILDING
        WHERE NOT EXISTS (SELECT 1
                                      FROM    PATIENT,PATIENT_IN,PATIENT_GOING_IN_ROOM,PATIENT P2,ROOM,WARD
                                      WHERE  PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
                                      AND      PATIENT.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
                                      AND      PATIENT_IN.PRESENT_IN = 1
                                      AND      PATIENT.PATIENT_NUM <> 0
                                      AND      PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
                                      AND      ROOM.F_W_CODE = WARD.F_W_CODE
                                      AND     WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
                                      AND      PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
                                      AND      PATIENT_GOING_IN_ROOM.GOING_OUT_TIME IS NULL
                                      AND      PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM)
        ORDER BY 1
        )
        --ORDER BY BUILDING.BUILDING_NUM`;

    const result = await runQuery(query);
    res.status(200).json({ success: true, str: "toto", data: result });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
