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
    return "";
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return year + '-' + formattedMonth + '-'+formattedDay
}

function findMaxMinTimes(times) {
  // Convert time strings to minutes since midnight
  const minutesSinceMidnight = times.map((time) => {
    const allowedTime= [1,2,3,4,5,6,7]
    const afterTwelve = parseInt(time.split(':')[0])
    const isPM = allowedTime.includes(afterTwelve);

    let [hours, minutes] = time.split(":").map(Number);
    if (isPM) {
      hours+=12
    }
    // Adjust for 12-hour format
    const totalMinutes = (hours % 12) * 60 + minutes + (hours >= 12 ? 720 : 0);
    return totalMinutes;
  });

  // Find maximum and minimum times
  const maxTime = Math.max(...minutesSinceMidnight);
  const minTime = Math.min(...minutesSinceMidnight);

  // Function to format time from minutes since midnight to hh:mm format
  const formatTime = (minutes) => {
    let hours = Math.floor(minutes / 60) % 12;
    hours = hours === 0 ? 12 : hours; // Convert 0 to 12
    const mins = minutes % 60;
    let period = "AM"; // Default to AM
    // Determine if time is between 01:00 and 08:00
    if ((hours >= 1 && hours <= 7) || (hours === 12 && mins !== 0)) {
      period = "PM";
    }
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
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
