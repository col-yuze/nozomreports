import { formatOracleDate, formatDate } from "@/lib/utils";

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
    const patientCode = req.query.patientCode;

    const HospMoratab = (result) => {
      const hosp = new Map();
      hosp.set("info", [[result[0][9], "الاسم", result[0][8], "رقم الحاسب"]]);
      result.sort((a, b) => {
        return a[0] - b[0];
      });
      var j = 0;
      const filtered_result = result.map((el, i) => {
        const id = formatDate(el[0]);
        const data = [i + 1, el[4], el[5]];
        if (!hosp.has(id)) {
          j++;
          hosp.set(id, [
            [
              el[7],
              "الصيدلية",
              el[3],
              "اسم المستخدم",
              formatDate(el[0]),
              "التاريخ",
              "تذكرة خارجي",
              j,
            ],
            ["م", "الدواء", "الجرعة"],
          ]);
        }
        hosp.get(id).push(data);

        return [i + 1, el[4], el[5]];
      });
      const grouped_result = Array.from(hosp, ([id, data]) => [id, data]);
      return grouped_result;
    };

    const query = `
    SELECT DISTINCT PRESCRIPTION.PRESCRIPTION_DATE,PRESCRIPTION.CREATION_USER,--PRESCRIPTION.CREATION_DATE,
            USERS.USER_DESC,USERS.USER_NAME,NVL(MEDICINE_USED.MEDICINE_NAME_A,PRESCRIPTION_MEDICINE.COMMENTS) MED_NM,PRESCRIPTION_MEDICINE.REQUEST_QUANTITY,PRESCRIPTION.PRESCRIPTION_TYPE,PHARMACY.PHARMACY_NAME,
            PRESCRIPTION.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL(PRESCRIPTION.PATIENT_NUM) PATIENT_NAME
FROM  PRESCRIPTION,PRESCRIPTION_MEDICINE,USERS,MEDICINE_USED,PHARMACY
WHERE PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE(+)
AND     PRESCRIPTION.CREATION_USER = USERS.USER_CODE
AND     PRESCRIPTION.PHARMACY_CODE = PHARMACY.PHARMACY_CODE
AND     PRESCRIPTION.CREATION_USER = USERS.USER_CODE
--AND     PRESCRIPTION.PRESCRIPTION_TYPE IN (3,7,8)
AND     PRESCRIPTION.PATIENT_NUM = ${patientCode}
AND     (PRESCRIPTION.PRESCRIPTION_DATE >= '${D1}' OR '${D1}' IS NULL)
AND     (PRESCRIPTION.PRESCRIPTION_DATE <= '${D2}' OR '${D2}' IS NULL)
ORDER BY PRESCRIPTION.PRESCRIPTION_DATE DESC,PRESCRIPTION.CREATION_USER
    `;
    const result = await runQuery(query);
    const filtered_result = HospMoratab(result);
    console.log(filtered_result);
    res.status(200).json({ success: true, data: filtered_result[2][1] });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
