import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropDown from "../components/DropDown";
import "react-dropdown/style.css";
import { format } from "date-fns";
import ReactTooltip from "react-tooltip";

export default function FromTo({
  setStartDateTwo,
  setEndDateTwo,
  selectedOption,
  setSelectedOption,
  selectedOptionII,
  setSelectedOptionII,
  selectedOptionIII,
  setSelectedOptionIII,
  mode,
}) {
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
        <div className="relative" style={{ width: "24%" }}>
          <DropDown
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            mode={mode}
          />
        </div>
        <div className="flex items-center" style={{ justifyContent: "end" }}>
          {mode === "1" ? (
            <>
              <div className="relative">
                <span style={{ display: "inline-block" }}>
                  <DatePicker
                    className="text-left border-l-4 border-green-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                    showIcon
                    placeholderText="نــهايــة الـفـتـرة"
                    selected={endDate}
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
                    data-tip={
                      startDate === null
                        ? "Please select a start date first"
                        : "You can't select an end date without a start date"
                    }
                  />
                </span>
              </div>

              <span className="mx-4 text-white text-2xl">إلى</span>
            </>
          ) : mode === "4" ? (
            <>
              <br />
              <DropDown
                selectedOption={selectedOptionII}
                setSelectedOption={setSelectedOptionII}
                mode="5"
                placeholderText="اختر الــقــسم"
              />
              <DropDown
                selectedOption={selectedOptionIII}
                setSelectedOption={setSelectedOptionIII}
                placeholderText="اختر الرتبة"
                mode="6"
              />
            </>
          ) : (
            ""
          )}
          <div className="relative">
            <span style={{ display: "inline-block" }}>
              <DatePicker
                className="text-left border-l-4 border-red-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                showIcon
                placeholderText={
                  mode === "1" ? "بــدايــة الـفـتـرة" : "اخــتـر"
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
