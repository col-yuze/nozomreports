export default function formatOracleDate(old_date) {
  // date in the format of MM-DD-YYYY
  old_date = old_date.split("-");
  // Date function takes YYYY-MM-DD
  const date = new Date(`${old_date[2]}-${old_date[1]}-${old_date[0]}`);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}
