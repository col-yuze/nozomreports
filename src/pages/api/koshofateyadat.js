import { formatDate, findMaxMinTimes, formatOracleDate } from "@/lib/utils";

const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

function ClinicStart(arr) {
  // add all meds
  const data = {};
  for (const [
    code,
    building,
    t_date,
    t_time,
    clinic_name,
  ] of arr) {
    data[clinic_name] = data[clinic_name] || {};
    // Initialize properties if they don't exist
    const { time, arrival, bul, date } = data[clinic_name];
    data[clinic_name] = {
      ...data[clinic_name],
      time: time || [],
      bul: bul || building,
      date: date || t_date,
    };

    data[clinic_name]["time"].push(t_time);
  }
  console.log(data)
  const result = [];
  var i = 1;
  for (const clinic in data) {
    const clinic_data = data[clinic];
    const { maxTime, minTime } = findMaxMinTimes(data[clinic].time);

    result.push([
      i,
      clinic_data.bul,
      clinic,
      formatDate(clinic_data.date),
      minTime,
      maxTime,
    ]);
    i++;
  }
  result.unshift([
    "م",
    "المبنى",
    "العيادة",
    "تاريخ الكشف",
    "أول كشف",
    "أخر كشف",
  ]);
  return result;
}

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    const DATE_IN = formatOracleDate(req.query.datein);

    // Your database queries or operations go here
    const query = `
      select clinic.clinic_code , clinic.clinic_room, patient_out.treatment_date, patient_out.treatment_time,V_CLINIC_NAME.CLINIC_OUT_NAME
from clinic
join patient_out
on clinic.CLINIC_CODE = patient_out.clinic_code
join v_clinic_name
on v_clinic_name.clinic_code = clinic.clinic_code
where patient_out.treatment_date ='${DATE_IN}'
AND       V_CLINIC_NAME.CLINIC_CODE NOT IN (20029110001,20029130001,20029140001,20029150001,20024110001,20078140001,
20093130001,20093140001,20093150001,20093160001,20093170001,20093180001,
20093190001,20002120001,10000000000,20044210001)
    `;
    const result = await runQuery(query);
    const filtered_res = ClinicStart(result);
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
