import { DATE } from "oracledb";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function formatDate(old_date) {
  // date in the format of MM-DD-YYYY
  old_date = old_date.split("-");
  // Date function takes YYYY-MM-DD
  const date = new Date(`${old_date[2]}-${old_date[1]}-${old_date[0]}`);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

export default async function handler(req, res) {
  let connection;
  // two dates in the format ex: 11-JAN-23
  const D1 = formatDate(req.query.param1); //req.data.param1;
  const D2 = formatDate(req.query.param2); //req.data.param2;
  try {
    connection = await connectToDatabase();
    // Your database queries or operations go here

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
                        AND      MORATAB_DATE BETWEEN '${D1}' AND '${D2}'  )
UNION ALL
SELECT MEDICINE_USED.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,633 PHARMACY_CODE,'ÕíÏáíÉ ÇáÕÏÑ ÇáÎÇÑÌíÉ' PHARMACY_NAME,PRESCRIPTION_MEDICINE_MON.REQUEST_QUANTITY
FROM    PRESCRIPTION_MEDICINE_MON,MEDICINE_USED
WHERE  PRESCRIPTION_MEDICINE_MON.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE IN (30209110001, 30209130001, 20090160001)
AND      EXISTS (SELECT 1
                        FROM    MORATAB_HISTORY
                        WHERE  MORATAB_HISTORY.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
                        AND      MORATAB_NXT_DATE BETWEEN '${D1}' AND '${D2}' )
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
