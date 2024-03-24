import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

//tafseely
const HospMoratabHagz = (result) => {
  if (result.length === 0) return [];
  const hosp = new Map();
  result.sort((a, b) => {
    return a[0] - b[0];
  });
  var j = 0;
  result.forEach((el, i) => {
    const id = el[0];
    const data = [el[4], el[5]];
    if (!hosp.has(id)) {
      j++;
      hosp.set(id, [
        ["م", j, "رقم الحاسب", el[0], "الاسم", el[2], "الغرفة", el[1]],
        ["الدواء", "الكمية"],
      ]);
    }
    hosp.get(id).push(data);
  });
  const grouped_result = Array.from(hosp, ([id, data]) => [id, data]);
  return grouped_result;
};
export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DEPT_IN = req.query.deptin;
    const ROOM_IN = req.query.roomin;
    const DATE_IN = formatOracleDate(req.query.datein);
    const QueryType = req.query.querytype;
    const query_tafseely = `
    SELECT DISTINCT PRESCRIPTION.PATIENT_NUM,ROOM.ROOM_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL(PRESCRIPTION.PATIENT_NUM) PATIENT_NAME,PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,PRESCRIPTION_MEDICINE.REQUEST_QUANTITY
FROM PRESCRIPTION,PRESCRIPTION_MEDICINE,MEDICINE_USED,PATIENT_GOING_IN_ROOM,ROOM ,DEPARTMENT
WHERE PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     ROOM.DEPARTMENT_CODE = DEPARTMENT.DEPARTMENT_CODE
AND     PATIENT_GOING_IN_ROOM.GOING_IN_DATE = (SELECT MAX(GOING_IN_DATE)
                                                                                 FROM PATIENT_GOING_IN_ROOM
                                                                                 WHERE PATIENT_NUM = PRESCRIPTION.PATIENT_NUM) 
AND     ROOM.DEPARTMENT_CODE = ${DEPT_IN}
AND     (PATIENT_GOING_IN_ROOM.ROOM_NUM = '${ROOM_IN}' OR '${ROOM_IN}' IS NULL)
AND     PRESCRIPTION.PRESCRIPTION_TYPE = 4
AND     PRESCRIPTION.PRESCRIPTION_DATE =  '${DATE_IN}'
    `;

    const query_egmaly = `
    SELECT PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,SUM(PRESCRIPTION_MEDICINE.REQUEST_QUANTITY) MED_CNT
FROM PRESCRIPTION,PRESCRIPTION_MEDICINE,MEDICINE_USED,PATIENT_GOING_IN_ROOM,ROOM ,DEPARTMENT
WHERE PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     ROOM.DEPARTMENT_CODE = DEPARTMENT.DEPARTMENT_CODE
AND     PATIENT_GOING_IN_ROOM.GOING_IN_DATE = (SELECT MAX(GOING_IN_DATE)
                                                                                 FROM PATIENT_GOING_IN_ROOM
                                                                                 WHERE PATIENT_NUM = PRESCRIPTION.PATIENT_NUM) 
AND     ROOM.DEPARTMENT_CODE =  ${DEPT_IN}
AND     (PATIENT_GOING_IN_ROOM.ROOM_NUM = '${ROOM_IN}' OR '${ROOM_IN}' IS NULL)
AND     PRESCRIPTION.PRESCRIPTION_TYPE = 4
AND     PRESCRIPTION.PRESCRIPTION_DATE =  '${DATE_IN}'
GROUP BY PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A
    `;
    var final_result = [];
    if (QueryType == 1) {
      const result = await runQuery(query_egmaly);
      final_result = result.map((el, i) => [i + 1, el[1], el[2]]);
      final_result.unshift(["م", "اسم الدواء", "الكمية"]);
    } else {
      const result = await runQuery(query_tafseely);
      final_result = HospMoratabHagz(result);
    }
    res.status(200).json({ success: true, data: final_result });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
