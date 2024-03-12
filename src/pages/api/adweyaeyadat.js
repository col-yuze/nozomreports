import formatOracleDate from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function countMedicineForPatients(arr, max_res_obj) {
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
    result.push([clinic, max_res_obj[clinic], ...clinic_count, sum]);
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
  place_arr_mapped.unshift("العدد الاقصي");
  place_arr_mapped.unshift("التخصص");
  result.unshift(place_arr_mapped);
  result.push(total_sum);

  return result;
}

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // get maximum aadad motaha lel 3eyadat
    const max_query = `
    SELECT  SPECIALISIM.M_SPEC_CODE,CLINIC.SPECIALISIM_CODE,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME,CLINIC.TR_P_NUM
FROM    V_CLINIC_NAME,CLINIC,SPECIALISIM
WHERE   V_CLINIC_NAME.CLINIC_CODE = CLINIC.CLINIC_CODE
AND      CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE 
AND       V_CLINIC_NAME.CLINIC_OUT_NAME NOT LIKE '%معطل%'
AND      CLINIC.TR_P_NUM > 0
AND       V_CLINIC_NAME.CLINIC_CODE NOT IN (20029110001,20029130001,20029140001,20029150001,20024110001,20078140001,
20093130001,20093140001,20093150001,20093160001,20093170001,20093180001,
20093190001,20002120001,10000000000,20044210001)
ORDER BY SPECIALISIM.M_SPEC_CODE,CLINIC.SPECIALISIM_CODE,CLINIC.TR_P_NUM DESC
    `;

    // Your database queries or operations go here
    const FD = formatOracleDate(req.query.fdate);
    const query = `
    SELECT RANK_CLASS.RANK_CLASS,RANK_CLASS.RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM IS NULL
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${FD}'
      UNION ALL
      SELECT 25 RANK_CLASS,'ÚÇÆáÇÊ ÖÈÇØ' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     P2.RANK IN (1,2,3,4,5,6,7,8,9,10,11)
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${FD}'
      UNION ALL
      SELECT 26 RANK_CLASS,'ÚÇÆáÇÊ ÕÝ' RANK_CLASS_NAME,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME CLINIC_NAME_A,RESERVE_CLINIC.PATIENT_NUM
      FROM   RESERVE_CLINIC,V_CLINIC_NAME,PATIENT P1,RANK_CLASS,PATIENT P2
      WHERE RESERVE_CLINIC.PATIENT_NUM = P1.PATIENT_NUM
      AND     P1.RANK = RANK_CLASS.RANK_CODE
      AND     P1.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM
      AND     RESERVE_CLINIC.CLINIC_CODE = V_CLINIC_NAME.CLINIC_CODE
      AND     RANK_CLASS.RANK_CLASS < 99
      AND     P2.RANK IN (12,13,14,15,16,17,18,19,23)
      AND     RESERVE_CLINIC.RESERVE_DATE >= '${FD}'
      AND     RESERVE_CLINIC.RESERVE_DATE <= '${FD}'
    `;
    // query to fetch aadad motaha
    const max_res = await runQuery(max_query);
    const max_res_obj = {};
    max_res.forEach((el) => {
      if (!max_res_obj[el[3]]) max_res_obj[el[3]] = el[4];
    });
    // query to preprocess data and filteration
    const result = await runQuery(query);
    const filtered_result = countMedicineForPatients(result, max_res_obj);
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
