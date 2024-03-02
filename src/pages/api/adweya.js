import formatOracleDate from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineAtPlaces(medicineArray) {
  const counts = {};
  const sums = {};
  const places = new Set();

  // Iterate through the medicine array
  for (const [medicine, place, quantity] of medicineArray) {
    // Increment the count for this medicine at this place
    counts[place] = counts[place] || {};
    counts[place][medicine] = (counts[place][medicine] || 0) + quantity;

    // Increment the sum for this medicine
    sums[medicine] = (sums[medicine] || 0) + quantity;

    places.add(place);
  }

  // Convert counts object to 2D array
  const result = [["", ...Array.from(places), "الاجمالي"]];
  let totalColumns = Array.from(places).fill(0);

  for (const medicine in sums) {
    const currentRow = [medicine];
    let total = 0;
    for (const place of places) {
      const count = counts[place]?.[medicine] || 0;
      currentRow.push(count);
      total += count;
      totalColumns[Array.from(places).indexOf(place)] += count;
    }
    currentRow.push(total);
    result.push(currentRow);
  }

  // Add total row
  const totalRow = [
    "الاجمالي",
    ...totalColumns,
    Object.values(sums).reduce((acc, val) => acc + val, 0),
  ];

  // Sort alphabetically
  result.sort((a, b) => a[0].localeCompare(b[0]));

  // Replace "?" with "صيدلية الصدر الخارجية"
  const mappedPlaces = Array.from(places).map((place) =>
    place.includes("?") ? "صيدلية الصدر الخارجية" : place
  );
  result.push(totalRow);
  result[0] = ["الدواء", ...mappedPlaces, "الاجمالي"];

  return result;
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
