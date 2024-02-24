import formatOracleDate from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineForPatients(arr) {
  // add all meds
  const meds = [];
  const counts = {};
  for (const [id, name, med_code, medicine, quantity] of arr) {
    meds.push(medicine);
    // for each id and medicine insert the quantity
    if (!counts[id]) counts[id] = {};

    // If the medicine doesn't exist at this place, initialize it
    if (!counts[id][name]) counts[id].name = name;
    if (!counts[id][medicine]) counts[id][medicine] = 0;

    // Increment the count for this medicine at this place
    counts[id][medicine] += quantity;
  }
  // remove unique values
  const unique_meds = meds.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  const result = [];
  for (const id in counts) {
    const medicineCounts = counts[id];
    const med_count = [];
    var sum = 0;
    for (const med_part of unique_meds) {
      med_count.push(medicineCounts[med_part] ?? "");
      if (typeof medicineCounts[med_part] === "number") {
        sum += medicineCounts[med_part];
      }
    }
    result.push([id, counts[id].name, ...med_count, sum]);
  }

  // append the first row to be headers
  unique_meds.unshift("رقم حاسب");
  unique_meds.unshift("الاسم");
  unique_meds.push("الاجمالي");
  result.unshift(unique_meds);
  return result;
}

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DEP_IN = req.query.dept;
    const DATE_IN = formatOracleDate(req.query.date);
    const query = `
    SELECT PRESCRIPTION.PATIENT_NUM,HOSP.F_GET_PAT_NAME_RANK_FULL(PRESCRIPTION.PATIENT_NUM) PATIENT_NAME,PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A,SUM(PRESCRIPTION_MEDICINE.REQUEST_QUANTITY) REQUEST_QUANTITY
FROM PRESCRIPTION,PRESCRIPTION_MEDICINE,MEDICINE_USED,PATIENT_GOING_IN_ROOM,ROOM
WHERE PRESCRIPTION.PRESCRIPTION_TYPE = PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE
AND     PRESCRIPTION.PRESCRIPTION_SERIAL = PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL
AND     PRESCRIPTION.PRESCRIPTION_DATE = PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE
AND     PRESCRIPTION_MEDICINE.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION.PATIENT_NUM = PATIENT_GOING_IN_ROOM.PATIENT_NUM
AND     PATIENT_GOING_IN_ROOM.ROOM_NUM = ROOM.ROOM_NUM
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_FLAG = 0
AND     PATIENT_GOING_IN_ROOM.GOING_OUT_DATE IS NULL
AND     ROOM.DEPARTMENT_CODE = ${DEP_IN}
AND     PRESCRIPTION.PRESCRIPTION_TYPE = 4
AND     PRESCRIPTION.PRESCRIPTION_DATE = '${DATE_IN}'
GROUP BY PRESCRIPTION.PATIENT_NUM,PRESCRIPTION_MEDICINE.MEDICINE_CODE,MEDICINE_USED.MEDICINE_NAME_A
    `;
    const result = await runQuery(query);
    const filtered_result = countMedicineForPatients(result);
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
