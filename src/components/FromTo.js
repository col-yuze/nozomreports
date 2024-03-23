import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropDown from "../components/DropDown";
import ReactDropDown from "react-dropdown";
import "react-dropdown/style.css";
import { format } from "date-fns";

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

  hospOptions,
  onHospChange,
  hospValue,
  qesmOptions,
  onQesmChange,
  qesmValue,
  ghorfaOptions,
  onGhorfaChange,
  ghorfaValue,
}) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const [selectedHosp, setSelectedHosp] = React.useState(null);
  const [selectedQesm, setSelectedQesm] = React.useState(null);
  // const formattedStartDate = startDate
  //   ? format(startDate, "dd-MM-yyyy")
  //   : "Select a start date";

  // // Format the endDate for display or show a placeholder if it's null
  // const formattedEndDate = endDate
  //   ? format(endDate, "dd-MM-yyyy")
  //   : "Select an end date";
  // setStartDate(formattedStartDate);
  // setEndDate(formattedEndDate);
  return (
    <>
      <div
        className="flex items-center"
        style={{ justifyContent: "end", justifyContent: "space-evenly" }}
      >
        {mode === "11" ? (
          <>
            <br />

            <div className="fixed-width-dropdown">
              <DropDown
                dynamicOptions={ghorfaOptions}
                dynamicOnChange={onGhorfaChange}
                dynamicValue={ghorfaValue}
                style={{ width: "200px" }}
                mode="ghorfa"
                placeholderText="اختر الــغرفــة"
              />
            </div>
            <br />

            <div className="fixed-width-dropdown">
              <DropDown
                dynamicOptions={qesmOptions}
                dynamicOnChange={onQesmChange}
                dynamicValue={qesmValue}
                style={{ width: "200px" }}
                mode="aqsamSpecific"
                placeholderText="اختر الــقــسم"
              />
            </div>
            <br />
            <div className="fixed-width-dropdown">
              <DropDown
                dynamicOptions={hospOptions}
                dynamicOnChange={onHospChange}
                dynamicValue={hospValue}
                style={{ width: "200px" }}
                mode="hosps"
                placeholderText="اختر الـمـستشـفى"
              />
            </div>
          </>
        ) : (
          ""
        )}
        {mode !== "11" ? (
          <div className="relative" style={{ maxwidth: "100%" }}>
            <DropDown
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              mode={mode}
              setSelectedHosp={setSelectedHosp}
              placeholderText={
                mode === "11" ? "اخـتـر المســتـشـفـى" : "اخــتــر"
              }
            />
          </div>
        ) : (
          ""
        )}

        <div className="flex items-center" style={{ justifyContent: "end" }}>
          {mode === "1" || mode === "mosts" || mode === "aqsam" ? (
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
                        : null;
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
          {mode !== "7" ? (
            <div className="relative">
              <span style={{ display: "inline-block" }}>
                <DatePicker
                  className="text-left border-l-4 border-red-500  w-full p-3 rounded text-lg    outline-none  focus:ring-0 bg-white"
                  showIcon
                  placeholderText={
                    mode === "1" || mode === "aqsam" || mode === "mosts"
                      ? "بــدايــة الـفـتـرة"
                      : "اخــتـر"
                  }
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);

                    const formattedStartDate = date
                      ? format(date, "dd-MM-yyyy")
                      : null;
                    setStartDateTwo(formattedStartDate);
                  }}
                  dateFormat="dd/MM/YYYY"
                  isClearable
                />
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
