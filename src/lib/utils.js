function formatOracleDate(old_date) {
  // null check
  if (old_date === null || old_date === undefined) {
    return "";
  }
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

function formatDate(date) {
  // null check
  if (date === null || date === undefined) {
    return ''
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return formattedDay + "-" + formattedMonth + "-" + year;
}

 function findMaxMinTimes(times) {
   // Convert time strings to minutes since midnight
   const minutesSinceMidnight = times.map((time) => {
     const [hours, minutes] = time.split(":").map(Number);
     return hours * 60 + minutes;
   });

   // Find maximum and minimum times
   const maxTime = Math.max(...minutesSinceMidnight);
   const minTime = Math.min(...minutesSinceMidnight);

   // Function to format time from minutes since midnight to HH:mm format
   const formatTime = (minutes) => {
     const hours = Math.floor(minutes / 60);
     const mins = minutes % 60;
     return `${hours.toString().padStart(2, "0")}:${mins
       .toString()
       .padStart(2, "0")}`;
   };

   // Format maximum and minimum times
   const maxTimeString = formatTime(maxTime);
   const minTimeString = formatTime(minTime);

   // Return object containing maximum and minimum times
   return {
     maxTime: maxTimeString,
     minTime: minTimeString,
   };
 }

export { formatOracleDate, formatDate, findMaxMinTimes };
