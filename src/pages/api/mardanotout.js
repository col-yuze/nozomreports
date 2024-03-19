import { formatOracleDate, formatDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

// preprocessing data
const PatientsHosps = (result) => {
  const hosps = new Map();
  result.sort((a, b) => a[0] - b[0]);

  result.forEach((el, i) => {
    const id = el[3];
    var data = [i + 1, el[1], el[5], formatDate(el[4]), el[2]];
    if (!hosps.has(id)) {
      hosps.set(id, [
        ["م", "رقم حاسب", "الرتبة/الاسم", "تاريخ الدخول", "الغرفة"],
      ]);
    }
    hosps.get(id).push(data);
  });
  // Increment the first element of each array for each hospital ID
  hosps.forEach((value) => {
    let counter = 1;
    value.forEach((arr,i) => {
      if (i !== 0)
      arr[0] = counter++;
        
    });
  });
  const grouped_result = Array.from(hosps, ([id, data]) => [id, data]);

  return grouped_result;
};
export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DATE_IN = formatOracleDate(req.query.datein);
    const query = `
    SELECT PATIENT.RANK,PATIENT.PATIENT_NUM,ROOM.ROOM_NUM,BUILDING.BUILDING_NUM,PATIENT_GOING_IN_ROOM.GOING_IN_DATE,HOSP.F_GET_PAT_NAME_RANK_FULL( PATIENT.PATIENT_NUM) RANK_FULL_NAME
FROM   PATIENT,PATIENT_IN,PATIENT_GOING_IN_ROOM,ROOM,WARD,BUILDING
WHERE PATIENT.PATIENT_NUM = PATIENT_IN.PATIENT_NUM
AND     PATIENT.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_IN.PRESENT_IN = 1
AND     PATIENT.PATIENT_NUM <> 0
--AND     PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_TIME IS NULL
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     PATIENT_GOING_IN_ROOM.GOING_IN_DATE < '${DATE_IN}'
AND     ROOM.F_W_CODE = WARD.F_W_CODE
AND     WARD.BUILDING_NUM = BUILDING.BUILDING_NUM
ORDER BY BUILDING.BUILDING_NUM
    `;
    const result = await runQuery(query);
    const filtered_result = PatientsHosps(result)
    res.status(200).json({ success: true, data: filtered_result });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
