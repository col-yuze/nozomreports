import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineForPatients(arr) {
  const counts = new Map();
  const uniqueMeds = new Set();

  // Iterate through the array and calculate medicine counts
  for (const [id, name, med_code, medicine, quantity] of arr) {
    // Initialize medicine count for the patient if not exists
    if (!counts.has(id)) {
      counts.set(id, { name, total: 0, medicines: new Map() });
    }

    // Increment medicine count for the patient
    const patient = counts.get(id);
    patient.total += quantity;

    // Increment medicine count
    const medicineCount = patient.medicines.get(medicine) || 0;
    patient.medicines.set(medicine, medicineCount + quantity);

    // Add medicine to uniqueMeds set
    uniqueMeds.add(medicine);
  }
  // Convert uniqueMeds set to an array
  const uniqueMedsArray = Array.from(uniqueMeds);

  // Construct result array
  const result = [["رقم حاسب", "الاسم", ...uniqueMedsArray, "الاجمالي"]];

  // Populate result array
  let columnSums = Array(uniqueMedsArray.length).fill(0); // Array to store column sums
  let totalSum = 0; // Total sum of all quantities
  for (const [id, data] of counts) {
    const medCounts = uniqueMedsArray.map((med, index) => {
      const count = data.medicines.get(med) || 0;
      columnSums[index] += count;
      return count;
    });
    result.push([id, data.name, ...medCounts, data.total]);
    totalSum += data.total;
  }

  // Add row containing column sums
  const columnSumRow = ["-", "الاجمالي", ...columnSums, totalSum];
  result.push(columnSumRow);

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
