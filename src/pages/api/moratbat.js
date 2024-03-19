import { formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function PatientsMoratabCount(arr) {
  // add all meds
  const counts = {};
  const ranks = [];
  for (const [patient_num, type, rank] of arr) {
    var type_name = "غير معروف";
    var rank_name = "غير معروف";
    if (type === 3) {
      type_name = "عادي";
    } else if (type === 8) {
      type_name = "صدر";
    }

    switch (rank) {
      case "?EC?":
        rank_name = "ضباط";
        break;
      case "ضباط  صف":
        rank_name = "ضباط صف";
        break;
      case "?EC? ??":
        rank_name = "ضباط صف";
        break;
      case "?C??CE ?EC? ??":
        rank_name = "عائلات ضباط صف";
        break;
      case "?C??CE ?EC?":
        rank_name = "عائلات ضباط";
        break;
      default:
        rank_name = rank;
        break;
    }

    ranks.push(rank_name);
    // for each id and medicine insert the quantity
    if (!counts[type_name]) counts[type_name] = {};

    // If the medicine doesn't exist at this place, initialize it
    if (!counts[type_name][rank_name]) counts[type_name][rank_name] = 0;

    // Increment the count for this medicine at this place
    counts[type_name][rank_name]++;
  }

  // remove unique values
  const unique_ranks = ranks.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  unique_ranks.sort((a, b) => a[0].localeCompare(b[0]));
    console.log(unique_ranks)
  const result = [];
  for (const type in counts) {
    const typeCounts = counts[type];
    var sum = 0;
    const type_count = [];
    for (const rank_part of unique_ranks) {
      type_count.push(typeCounts[rank_part] ?? 0);
      if (typeof typeCounts[rank_part] === "number") {
        sum += typeCounts[rank_part];
      }
    }
    result.push([type, ...type_count, sum]);
  }
  result.sort((a, b) => a[0].localeCompare(b[0]));
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

  unique_ranks.unshift("النوع");
  unique_ranks.push("الاجمالي");
  result.unshift(unique_ranks);
  result.push(total_sum);

  // convert rows to columns
  const transposedArray = result[0].map((col, i) =>
    result.map((row) => row[i])
  );

  return transposedArray;
}

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here
    const FD = formatOracleDate(req.query.fdate);
    const TD = formatOracleDate(req.query.tdate);
    const query = `
    SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ضباط' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 3
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE NOT IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ضباط  صف' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 3
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE NOT IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ÚÇÆáÇÊ ÖÈÇØ' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT,PATIENT P2
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL 
AND      P2.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 3
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE NOT IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ÚÇÆáÇÊ ÖÈÇØ ÕÝ' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT,PATIENT P2
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL 
AND      P2.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 3
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE NOT IN (8,90) )
UNION
-------------------------------
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ÖÈÇØ' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 8
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ÖÈÇØ ÕÝ' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 8
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'عائلات ضباط' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT,PATIENT P2
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL 
AND      P2.RANK IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 8
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE IN (8,90) )
UNION
SELECT DISTINCT PATIENT.PATIENT_NUM,PRESCRIPTION.PRESCRIPTION_TYPE,'ÚÇÆáÇÊ ÖÈÇØ ÕÝ' PATIENT_TYPE
FROM   PRESCRIPTION,PATIENT,PATIENT P2
WHERE PRESCRIPTION.PATIENT_NUM = PATIENT.PATIENT_NUM
AND      PATIENT.KINSHIP_PATIENT_NUM = P2.PATIENT_NUM(+)
AND      PRESCRIPTION.PRESCRIPTION_DATE >= '${FD}'
AND      PRESCRIPTION.PRESCRIPTION_DATE <= '${TD}'
AND      PATIENT.KINSHIP_PATIENT_NUM IS NOT NULL 
AND      P2.RANK IN (12, 13, 14, 15, 16, 17, 18, 19, 23) 
AND      PRESCRIPTION.PRESCRIPTION_TYPE = 8
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE
                        WHERE    PRESCRIPTION_MEDICINE.PRESCRIPTION_SERIAL = PRESCRIPTION.PRESCRIPTION_SERIAL
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_DATE = PRESCRIPTION.PRESCRIPTION_DATE
                        AND        PRESCRIPTION_MEDICINE.PRESCRIPTION_TYPE = PRESCRIPTION.PRESCRIPTION_TYPE)
AND     EXISTS (SELECT 1 
                        FROM    PRESCRIPTION_MEDICINE_MON,CLINIC1
                        WHERE   PRESCRIPTION_MEDICINE_MON.PATIENT_NUM = PRESCRIPTION.PATIENT_NUM
                        AND       PRESCRIPTION_MEDICINE_MON.CLINIC_CODE = CLINIC1.CLINIC_CODE
                        AND      CLINIC1.SPECIALISIM_CODE IN (8,90) )
    `;
    const result = await runQuery(query);
    const filtered_result = PatientsMoratabCount(result);
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
