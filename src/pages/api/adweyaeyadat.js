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
    const FD = formatOracleDate(req.query.fdate);
    const TD = formatOracleDate(req.query.tdate);
    const query = `
    SELECT RANK_CLASS.RANK_CLASS,RANK_CLASS.RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM IS NULL
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'
      UNION ALL
      SELECT 25 RANK_CLASS,'ÚÇÆáÇÊ ÖÈÇØ' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     P2.RANK IN (1,2,3,4,5,6,7,8,9,10,11)
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'
      UNION ALL
      SELECT 26 RANK_CLASS,'ÚÇÆáÇÊ ÕÝ' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     P2.RANK IN (12,13,14,15,16,17,18,19,23)
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'
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
