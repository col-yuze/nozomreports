import formatOracleDate from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineAtPlaces(medicineArray) {
  // Create an object to store counts
  const counts = {};
  const sums = {};
  const place_arr = ["الدواء"];

  // Iterate through the medicine array
  for (const [medicine, place, quantity] of medicineArray) {
    // If the place doesn't exist in counts, initialize it
    if (!counts[place]) {
      counts[place] = {};
    }
    // If the medicine doesn't exist at this place, initialize it
    if (!counts[place][medicine]) {
      counts[place][medicine] = 0;
    }
    // Increment the count for this medicine at this place
    counts[place][medicine] += quantity;

    // If the medicine doesn't exist in sums, initialize it
    if (!sums[medicine]) {
      sums[medicine] = 0;
    }
    // Increment the sum for this medicine
    sums[medicine] += quantity;
  }
  // Convert counts object to 2D array
  const result = [];
  for (const p in counts) {
    place_arr.push(p);
  }
  for (const place in counts) {
    const medicineCounts = counts[place];
    for (const medicine in medicineCounts) {
      result.push([
        medicine,
        counts[place_arr[1]][medicine] ?? "",
        counts[place_arr[2]][medicine] ?? "",
        counts[place_arr[3]][medicine] ?? "",
        counts[place_arr[4]][medicine] ?? "",
        counts[place_arr[5]][medicine] ?? "",
        counts[place_arr[6]][medicine] ?? "",
        sums[medicine],
      ]);
    }
  }
  console.log(result);
  // sort alphabetically
  result.sort((a, b) => a[0].localeCompare(b[0]));
  // remove dupes
  const uniqueResult = Array.from(new Set(result.map(JSON.stringify))).map(
    JSON.parse
  );
  place_arr.push("الاجمالي");
  const place_arr_mapped = place_arr.map((el) => {
    return el.includes("?") ? "صيدلية الصدر الخارجية" : el;
  });
  uniqueResult.unshift(place_arr_mapped);
  return uniqueResult;
}

export default async function handler(req, res) {
  let connection;
  // two dates in the format ex: 11-JAN-23
  const D1 = formatOracleDate(req.query.param1); //req.data.param1;
  const D2 = formatOracleDate(req.query.param2); //req.data.param2;
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
    const filtered_res_table = result.map((el) => [el[1], el[3], el[4]]);
    const filtered_res = countMedicineAtPlaces(filtered_res_table);

    res.status(200).json({ success: true, data: filtered_res });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
