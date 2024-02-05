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
    const RANK_IN = req.data.param1;
    const SPEC_IN = req.data.param2;
    const CNT_IN = req.data.param3;
    const DATE_IN = req.data.param4;
    const query = `
    SELECT PRESCRIPTION_MEDICINE_MON.PATIENT_NUM,GET_PAT_RANK_NAME_FULL(PRESCRIPTION_MEDICINE_MON.PATIENT_NUM) RANK_NAME,COUNT(*) CNT
FROM   PRESCRIPTION_MEDICINE_MON,PATIENT,CLINIC
WHERE PATIENT.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
AND       (PATIENT.RANK = ${RANK_IN}OR ${RANK_IN} = 0)
AND      CLINIC.CLINIC_CODE = PRESCRIPTION_MEDICINE_MON.CLINIC_CODE
 AND     (CLINIC.SPECIALISIM_CODE = ${SPEC_IN} OR ${SPEC_IN} = 0)
AND     EXISTS (SELECT 1
                        FROM PRESCRIPTION_MEDICINE_MON PM2
                        WHERE PM2.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                        HAVING COUNT(*) > ${CNT_IN}
                        GROUP BY PM2.PATIENT_NUM)
AND  EXISTS (SELECT 1
                         FROM    PRESCRIPTION
                         WHERE  PRESCRIPTION.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                         AND      PRESCRIPTION_TYPE IN (3,8)
                         AND      (PRESCRIPTION.PRESCRIPTION_DATE >= ${DATE_IN} OR ${DATE_IN} IS NULL))
GROUP BY PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
ORDER BY 3 DESC,2
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
