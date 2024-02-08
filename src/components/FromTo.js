import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropDown from "../components/DropDown";
import "react-dropdown/style.css";

export default function FromTo() {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  console.log(startDate);
  return (
    <>
      <div
        date-rangepicker
        class="flex items-center"
        style={{ justifyContent: "end", justifyContent: "space-between" }}
      >
        <div class="relative">
          <DropDown />
        </div>
        <div class="flex items-center" style={{ justifyContent: "end" }}>
          <div class="relative">
            <span style={{ display: "inline-block" }}>
              <DatePicker
                className="text-left border-l-4 border-green-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                showIcon
                placeholderText="نــهايــة الـفـتـرة"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/YYYY"
                isClearable
              />
            </span>
          </div>
          <span class="mx-4 text-white text-2xl">إلى</span>
          <div class="relative">
            <span style={{ display: "inline-block" }}>
              <DatePicker
                className="text-left border-l-4 border-red-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                showIcon
                placeholderText="بــدايــة الـفـتـرة"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/YYYY"
                isClearable
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
