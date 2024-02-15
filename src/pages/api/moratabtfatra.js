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
    const D1 = formatOracleDate(req.query.fdate);
    const D2 = formatOracleDate(req.query.tdate);
    const query = `
    SELECT DISTINCT PRESCRIPTION.PRESCRIPTION_DATE,PRESCRIPTION.CREATION_USER,--PRESCRIPTION.CREATION_DATE,
            USERS.USER_DESC,USERS.USER_NAME,NVL(MEDICINE_USED.MEDICINE_NAME_A,PRESCRIPTION_MEDICINE.COMMENTS) MED_NM,PRESCRIPTION_MEDICINE.REQUEST_QUANTITY,PRESCRIPTION.PRESCRIPTION_TYPE,PHARMACY.PHARMACY_NAME
FROM  PRESCRIPTION,PRESCRIPTION_MEDICINE,USERS,MEDICINE_USED,PHARMACY
WHERE PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE(+)
AND     PRESCRIPTION.CREATION_USER = USERS.USER_CODE
AND     PRESCRIPTION.PHARMACY_CODE = PHARMACY.PHARMACY_CODE
AND     PRESCRIPTION.CREATION_USER = USERS.USER_CODE
--AND     PRESCRIPTION.PRESCRIPTION_TYPE IN (3,7,8)
AND     PRESCRIPTION.PATIENT_NUM = :PATIENT_IN
AND     (PRESCRIPTION.PRESCRIPTION_DATE >= '${D1}' OR '${D1}' IS NULL)
AND     (PRESCRIPTION.PRESCRIPTION_DATE <= '${D2}' OR '${D2}' IS NULL)
ORDER BY PRESCRIPTION.PRESCRIPTION_DATE DESC,PRESCRIPTION.CREATION_USER
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
