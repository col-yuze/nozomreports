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
    const DATE_IN = req.data.param1;
    const query = `
    SELECT  SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A,COUNT(DISTINCT PRESCRIPTION_MEDICINE_MON.PATIENT_NUM) CNT
FROM PRESCRIPTION_MEDICINE_MON,CLINIC,SPECIALISIM
WHERE PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC.CLINIC_CODE
AND    CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE
AND     CLINIC.SPECIALISIM_CODE NOT IN (8,9,13,18,52,53,54)
AND    EXISTS (SELECT 1
                      FROM    PRESCRIPTION
                      WHERE PRESCRIPTION.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                      AND     PRESCRIPTION.PRESCRIPTION_TYPE IN (3,8)
                      AND     PRESCRIPTION_DATE >= ${DATE_IN})
GROUP BY SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A
ORDER BY 1
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
