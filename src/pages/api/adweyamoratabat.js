import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

// function MedicineCounts(arr) {
//   // add all meds
//   const counts = {};
//   for (const [med_count, med_en, med_ar, med_code] of arr) {
//     // for each id and medicine insert the quantity
//     if (!counts[med_ar]) counts[med_ar] = med_count;
//     else {
//       counts[med_ar] += med_count;
//     }
//   }

//   // Convert counts object back to array format
//   const result = [];
//   for (const [med_ar, count] of Object.entries(counts)) {
//     result.push([med_ar, count]);
//   }

//   // Sort the result array by medication Arabic name (med_ar)
//   result.sort((a, b) => a[0].localeCompare(b[0]));

//   const final_result = result.map((el, i) =>
//     [i+1,...el])
//   // Append the headers
//   final_result.unshift(["م", "اسم الدواء", "عدد الصارفين"]);

//   return final_result;
// }

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const DATE_IN = formatOracleDate(req.query.fdate);
    const TYPE_IN = req.query.typein;
    const query = `
    SELECT COUNT(DISTINCT PRESCRIPTION_MEDICINE_MON.PATIENT_NUM) PAT_CNT,MEDICINE_USED.MEDICINE_NAME_E,MEDICINE_USED.MEDICINE_NAME_A, MEDICINE_USED.MEDICINE_CODE
FROM PRESCRIPTION_MEDICINE_MON,PRESCRIPTION,MEDICINE_USED
WHERE PRESCRIPTION.PATIENT_NUM = PRESCRIPTION_MEDICINE_MON.PATIENT_NUM
AND     PRESCRIPTION_MEDICINE_MON.MEDICINE_CODE = MEDICINE_USED.MEDICINE_CODE
AND     PRESCRIPTION.PRESCRIPTION_DATE > '${DATE_IN}'
AND     PRESCRIPTION.PRESCRIPTION_TYPE = ${TYPE_IN}
GROUP BY MEDICINE_USED.MEDICINE_NAME_E, MEDICINE_USED.MEDICINE_NAME_A,MEDICINE_USED.MEDICINE_CODE
ORDER BY 1 DESC
    `;
    const result = await runQuery(query);
    //968 with unqique 975
    // const filtered_result =MedicineCounts(result);
    result.sort((a, b) => a[1].localeCompare(b[1]));

    const filtered_result = result.map((el, i) => [i + 1, el[2], el[0]]);
    filtered_result.unshift(["م", "اسم الدواء", "عدد الصارفين"]);

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
