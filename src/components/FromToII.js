import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropDown from "../components/DropDown";
import "react-dropdown/style.css";
import { format } from "date-fns";
import ReactTooltip from "react-tooltip";

export default function FromToII({ setStartDateTwo, setEndDateTwo, two }) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  // const formattedStartDate = startDate
  //   ? format(startDate, "dd-MM-yyyy")
  //   : "Select a start date";

  // // Format the endDate for display or show a placeholder if it's null
  // const formattedEndDate = endDate
  //   ? format(endDate, "dd-MM-yyyy")
  //   : "Select an end date";
  // console.log(formattedStartDate);
  // console.log(formattedEndDate);
  // setStartDate(formattedStartDate);
  // setEndDate(formattedEndDate);
  return (
    <>
      <div
        date-rangepicker
        className="flex items-center"
        style={{ justifyContent: "end", justifyContent: "space-evenly" }}
      >
        <div className="flex items-center" style={{ justifyContent: "end" }}>
          {two === "true" ? (
            <>
              <div className="relative">
                <span style={{ display: "inline-block" }}>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Tooltip content
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>

                  <DatePicker
                    className="text-left border-l-4 border-green-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                    showIcon
                    placeholderText="نــهايــة الـفـتـرة"
                    selected={endDate}
                    style={{ width: "250%", ...style }}
                    onChange={(date) => {
                      setEndDate(date);

                      const formattedEndDate = date
                        ? format(date, "dd-MM-yyyy")
                        : "haven't selected an end date";
                      setEndDateTwo(formattedEndDate);
                    }}
                    minDate={startDate}
                    dateFormat="dd/MM/YYYY"
                    isClearable
                    disabled={startDate === null}
                    data-tooltip-target="tooltip-default"
                  />
                </span>
              </div>
              <span className="mx-4 text-white text-2xl">إلى</span>
            </>
          ) : (
            " "
          )}
          <div className="relative">
            <span style={{ display: "inline-block" }}>
              <DatePicker
                className="text-left border-l-4 border-red-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                showIcon
                data-tooltip-target="tooltip-default"
                placeholderText={
                  two === "true" ? "بــدايــة الـفـتـرة" : "اخـــتــــر"
                }
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);

                  const formattedStartDate = date
                    ? format(date, "dd-MM-yyyy")
                    : "haven't selected a start date";
                  setStartDateTwo(formattedStartDate);
                }}
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
