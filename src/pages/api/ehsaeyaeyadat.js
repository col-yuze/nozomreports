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
  for (const [id, rank, med_code, clinic, code, max_bed] of arr) {
    ranks.push(rank);
    // for each id and medicine insert the quantity
    if (!counts[clinic]) counts[clinic] = {};

    // If the medicine doesn't exist at this place, initialize it
    if (!counts[clinic].max_bed) counts[clinic].max_bed = max_bed;
    if (!counts[clinic][rank]) counts[clinic][rank] = 0;

    // Increment the count for this medicine at this place
    counts[clinic][rank]++;
  }
  // remove unique values
  const unique_clinics = ranks.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  const result = [];
  for (const clinic in counts) {
    const clinicCounts = counts[clinic];
    const clinic_count = [];
    var sum = 0;
    for (const clinic_part of unique_clinics) {
      clinic_count.push(clinicCounts[clinic_part] ?? 0);
      if (typeof clinicCounts[clinic_part] === "number") {
        sum += clinicCounts[clinic_part];
      }
    }
    result.push([clinic, counts[clinic].max_bed, ...clinic_count, sum]);
  }

  const sum_arr = ["", "الاجمالي", 0, 0, 0, 0, 0, 0, 0, 0];
  for (const [num, hosp, df, d, l, g, s, sf, m, t] of result) {
    sum_arr[2] += df;
    sum_arr[3] += d;
    sum_arr[4] += l;
    sum_arr[5] += g;
    sum_arr[6] += s;
    sum_arr[7] += sf;
    sum_arr[8] += m;
    sum_arr[9] += t;
  }
  result.push(sum_arr);
  // append the first row to be headers
  unique_clinics.unshift("السعة القصوي");
  unique_clinics.unshift("التخصص");
  unique_clinics.push("الاجمالي");
  result.unshift(unique_clinics);
  return result;
}

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DATE_IN = formatOracleDate(req.query.datein);
    const query = `
    
SELECT RANK_CLASS.RANK_CLASS,RANK_CLASS.RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM,CLINIC.TR_P_NUM
FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,CLINIC
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM IS NULL
AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RANK_CLASS.RANK_CLASS < 99
AND     RESERVE_CLINIC.RESERVE_DATE = '${DATE_IN}'
UNION ALL
SELECT 25 RANK_CLASS,'عائلات ضباط' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM,CLINIC.TR_P_NUM
FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2,CLINIC CLINIC
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RANK_CLASS.RANK_CLASS < 99
AND     P2.RANK IN (1,2,3,4,5,6,7,8,9,10,11)
AND     RESERVE_CLINIC.RESERVE_DATE = '${DATE_IN}'
UNION ALL
SELECT 26 RANK_CLASS,'عائلات صف' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM,CLINIC.TR_P_NUM
FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2,CLINIC
WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
AND     P1.RANK = RANK_CLASS.RANK_CODE
AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
AND     RESERVE_CLINIC.CLINIC_CODE = CLINIC.CLINIC_CODE
AND     RANK_CLASS.RANK_CLASS < 99
AND     P2.RANK IN (12,13,14,15,16,17,18,19,23)
AND     RESERVE_CLINIC.RESERVE_DATE = '${DATE_IN}'
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
