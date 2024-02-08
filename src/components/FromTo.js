import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FromTo() {
  const [startDate, setStartDate] = React.useState(null);
  return (
    <>
      <div date-rangepicker class="flex items-center">
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>
          <input
            name="start"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date start"
          />
        </div>
<<<<<<< Updated upstream
        <span class="mx-8 text-gray-500 text-2xl">إلى</span>
        <div class="relative">
          <DatePicker
            placeholderText="بداية الفترة"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            icon="fa fa-calendar"
            dateFormat="dd/MM/YYYY"
          />
=======
        <span class="mx-4 text-gray-500 text-lg">إلى</span>
        <div class="relative">
          <span style={{ display: "inline-block" }}>
            <DatePicker
              className="text-left border-l-4 border-red-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
              showIcon
              placeholderText="Click to select a date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/YYYY"
              isClearable
            />
          </span>
>>>>>>> Stashed changes
        </div>
      </div>
    </>
  );
}
