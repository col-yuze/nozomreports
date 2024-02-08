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
    const D1 = req.data.param1;
    const D2 = req.data.param2;
    const query = `
    SELECT MEDICINE_USED.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,PHARMACY.PHARMACY_CODE,PHARMACY.PHARMACY_NAME,PRESCRIPTION_MEDICINE_MON.REQUEST_QUANTITY
FROM    PRESCRIPTION_MEDICINE_MON,MEDICINE_USED,PATIENT,RANK_CLASS,PHARMACY
WHERE  PRESCRIPTION_MEDICINE_MON.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PATIENT.PATIENT_NUM
AND     PATIENT.RANK = RANK_CLASS.RANK_CODE
AND     RANK_CLASS.PHARMACY_CODE = PHARMACY.PHARMACY_CODE
AND     PRESCRIPTION_MEDICINE_MON.CLINIC_CODE NOT IN (30209110001, 30209130001, 20090160001)
AND     EXISTS (SELECT 1
                        FROM    PATIENT
                        WHERE  PATIENT.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                        AND      MORATAB_DATE BETWEEN ${D1} AND ${D2}  )
UNION ALL
SELECT MEDICINE_USED.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,633 PHARMACY_CODE,'ÕíÏáíÉ ÇáÕÏÑ ÇáÎÇÑÌíÉ' PHARMACY_NAME,PRESCRIPTION_MEDICINE_MON.REQUEST_QUANTITY
FROM    PRESCRIPTION_MEDICINE_MON,MEDICINE_USED
WHERE  PRESCRIPTION_MEDICINE_MON.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE IN (30209110001, 30209130001, 20090160001)
AND      EXISTS (SELECT 1
                        FROM    MORATAB_HISTORY
                        WHERE  MORATAB_HISTORY.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                        AND      MORATAB_NXT_DATE BETWEEN ${D1} AND ${D2} )
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
