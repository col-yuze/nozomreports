import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineForPatients(arr) {
  // add all meds
  const ranks = [];
  const counts = {};
  for (const [order, rank, rank_number, clinic, clinic_number] of arr) {
    ranks.push(rank);
    // for each id and medicine insert the quantity
    if (!counts[clinic]) counts[clinic] = {};

    // If the medicine doesn't exist at this place, initialize it
    if (!counts[clinic][rank]) counts[clinic][rank] = 0;

    // Increment the count for this medicine at this place
    counts[clinic][rank]++;
  }
  // remove unique values
  const unique_ranks = ranks.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  const result = [];
  for (const clinic in counts) {
    const clinicCounts = counts[clinic];

    var sum = 0;
    const clinic_count = [];
    for (const rank_part of unique_ranks) {
      clinic_count.push(clinicCounts[rank_part] ?? 0);
      if (typeof clinicCounts[rank_part] === "number") {
        sum += clinicCounts[rank_part];
      }
    }
    result.push([clinic, ...clinic_count, sum]);
  }

  // calculate sum
  const total_sum = result.reduce((acc, row) => {
    row.forEach((el, i) => {
      acc[i] = (acc[i] || 0) + el;
    });
    return acc;
  }, []);
  total_sum[0] = "الاجمالي";
  // append the first row to be headers
  const place_arr_mapped = unique_ranks.map((el) => {
    return el.includes("?EC?")
      ? "عائلات ضباط"
      : el.includes("??CE")
      ? "عائلات صف"
      : el;
  });
  place_arr_mapped.push("الاجمالي");
  place_arr_mapped.unshift("التخصص");
  result.unshift(place_arr_mapped);
  result.push(total_sum);

  return result;
}
export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const FD = formatOracleDate(req.query.fdate);
    const TD = formatOracleDate(req.query.tdate);
    const query = `
  SELECT RANK_CLASS.RANK_CLASS,RANK_CLASS.RANK_CLASS_NAME,SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A,RESERVE_CLINIC.PATIENT_NUM
FROM   RESERVE_CLINIC,CLINIC1 CLINIC,SPEC_KOBBA SPECIALISIM,PATIENT P1,RANK_CLASS
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM IS NULL
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RESERVE_CLINIC.HOSP_CODE    = CLINIC.HOSP_CODE
AND     CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE(+)
AND     CLINIC.SPECIALISIM_CODE NOT IN (24,88,93)
AND     RANK_CLASS.RANK_CLASS < 99
AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'
UNION ALL
SELECT 25 RANK_CLASS,'عائلات ضباط' RANK_CLASS_NAME,SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A,RESERVE_CLINIC.PATIENT_NUM
FROM   RESERVE_CLINIC,CLINIC1 CLINIC,SPEC_KOBBA SPECIALISIM,PATIENT P1,RANK_CLASS,PATIENT P2
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     P2.RANK IN (1,2,3,4,5,6,7,8,9,10,11)
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RESERVE_CLINIC.HOSP_CODE    = CLINIC.HOSP_CODE
AND     CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE(+)
AND     CLINIC.SPECIALISIM_CODE NOT IN (24,88,93)
AND     RANK_CLASS.RANK_CLASS < 99
AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'

UNION ALL
SELECT 26 RANK_CLASS,'عائلات صف' RANK_CLASS_NAME,SPECIALISIM.SPECIALISIM_CODE,SPECIALISIM.SPECIALISIM_NAME_A,RESERVE_CLINIC.PATIENT_NUM
FROM   RESERVE_CLINIC,CLINIC1 CLINIC,SPEC_KOBBA SPECIALISIM,PATIENT P1,RANK_CLASS,PATIENT P2
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     P2.RANK IN (12,13,14,15,16,17,18,19,23)
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RESERVE_CLINIC.HOSP_CODE    = CLINIC.HOSP_CODE
AND     CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE(+)
AND     CLINIC.SPECIALISIM_CODE NOT IN (24,88,93)
AND     RANK_CLASS.RANK_CLASS < 99
AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
AND     RESERVE_CLINIC.RESERVE_DATE <= '${TD}'
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
