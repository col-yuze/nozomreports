import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");


function PatientsArrivalCounts(arr) {
  // add all meds
  const clinics = [];
  const counts = {};
  for (const [rank_order, rank, arrival_type, clinic, code] of arr) {
    clinics.push(clinic);
    // for each id and medicine insert the quantity
    if (!counts[rank]) counts[rank] = {};

    // If the medicine doesn't exist at this place, initialize it
    if (!counts[rank][clinic]) counts[rank][clinic] = 0;

    // Increment the count for this medicine at this place
    counts[rank][clinic]++;
  }
  // remove unique values
  const unique_clinics = clinics.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  // Sort alphabetically
  unique_clinics.sort((a, b) => a[0].localeCompare(b[0]));

  const result = [];
  for (const rank in counts) {
    const rankCounts = counts[rank];
    var sum = 0;
    const rank_count = [];
    for (const clinic_part of unique_clinics) {
      rank_count.push(rankCounts[clinic_part] ?? 0);
      if (typeof rankCounts[clinic_part] === "number") {
        sum += rankCounts[clinic_part];
      }
    }
    result.push([rank, ...rank_count, sum]);
  }

  // reduce to a single array with all the values total_sum
  const total_sum = result.reduce((acc, row) => {
    row.forEach((el, i) => {
      acc[i] = (acc[i] || 0) + el;
    });
    // add this row to the end of the array
    // filtered_res.push(acc);
    return acc;
  }, []);
  total_sum[0] = "الاجمالي";

  unique_clinics.push("الاجمالي");
  unique_clinics.unshift("الرتبة / الدرجة");

  result.unshift(unique_clinics);
  result.push(total_sum);

  return result;
}
export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DATE_IN = req.query.datein;
    const query = `
    SELECT PATIENT.RANK,V_RANKS.RAMK_NAME,ARRIVAL.ARRIVAL_TYPE,V_ARRIVAL_TYPE.TYPE_NAME,ARRIVAL.PATIENT_NUM
FROM ARRIVAL,PATIENT,V_RANKS,V_ARRIVAL_TYPE
WHERE ARRIVAL.PATIENT_NUM = PATIENT.PATIENT_NUM
AND     PATIENT.RANK = V_RANKS.RANK_CODE
AND     ARRIVAL.ARRIVAL_TYPE = V_ARRIVAL_TYPE.TYPE_CODE
AND     PATIENT.RANK <> 20
AND     TO_CHAR(ARRIVAL.ARRIVAL_DATE,'DD-MM-YYYY') = '${DATE_IN}'
UNION
SELECT  50 RANK,V_RANKS.RAMK_NAME,ARRIVAL.ARRIVAL_TYPE,V_ARRIVAL_TYPE.TYPE_NAME,ARRIVAL.PATIENT_NUM
FROM ARRIVAL,PATIENT,V_RANKS,V_ARRIVAL_TYPE
WHERE ARRIVAL.PATIENT_NUM = PATIENT.PATIENT_NUM
AND     PATIENT.RANK = V_RANKS.RANK_CODE
AND     ARRIVAL.ARRIVAL_TYPE = V_ARRIVAL_TYPE.TYPE_CODE
AND     PATIENT.RANK = 20
AND     PATIENT.KINSHIP_PATIENT_NUM IS NULL
AND     TO_CHAR(ARRIVAL.ARRIVAL_DATE,'DD-MM-YYYY') = '${DATE_IN}'
UNION
SELECT 30 RANK,'عائلات ضباط' RAMK_NAME,ARRIVAL.ARRIVAL_TYPE,V_ARRIVAL_TYPE.TYPE_NAME,ARRIVAL.PATIENT_NUM
FROM ARRIVAL,PATIENT,V_RANKS,V_ARRIVAL_TYPE,PATIENT P2
WHERE ARRIVAL.PATIENT_NUM = PATIENT.PATIENT_NUM
AND     PATIENT.RANK = V_RANKS.RANK_CODE
AND     ARRIVAL.ARRIVAL_TYPE = V_ARRIVAL_TYPE.TYPE_CODE
AND     PATIENT.RANK = 20
AND     PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     P2.RANK BETWEEN 1 AND 11
AND     TO_CHAR(ARRIVAL.ARRIVAL_DATE,'DD-MM-YYYY') = '${DATE_IN}'
UNION
SELECT 40 RANK,'عائلات صف' RAMK_NAME,ARRIVAL.ARRIVAL_TYPE,V_ARRIVAL_TYPE.TYPE_NAME,ARRIVAL.PATIENT_NUM
FROM ARRIVAL,PATIENT,V_RANKS,V_ARRIVAL_TYPE,PATIENT P2
WHERE ARRIVAL.PATIENT_NUM = PATIENT.PATIENT_NUM
AND     PATIENT.RANK = V_RANKS.RANK_CODE
AND     ARRIVAL.ARRIVAL_TYPE = V_ARRIVAL_TYPE.TYPE_CODE
AND     PATIENT.RANK = 20
AND     PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     P2.RANK BETWEEN 12 AND 24
AND     TO_CHAR(ARRIVAL.ARRIVAL_DATE,'DD-MM-YYYY') = '${DATE_IN}'
    `;
    const result = await runQuery(query);
    const filtered_result = PatientsArrivalCounts(result)
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
