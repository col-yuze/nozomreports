"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import Button from "@mui/material/Button";
import FromTo from "../../../components/FromTo";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import MyDocument2 from "./pdfAqsam";
import { CircularProgress } from "@mui/material";

import ReactTooltip from "react-tooltip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function Mahgoozfatra() {
  const [rows, setRows] = React.useState([]);
  const [show, setShow] = React.useState(false);
  // prettier-ignore
  const [startDate, setStartDate] = React.useState(null);

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [aqsamOrMosts, setAqsamOrMosts] = useState("aqsam");
  const [selectedOptionStatic, setSelectedOptionStatic] = useState(null);
  // prettier-ignore
  const [endDate, setEndDate] = React.useState(null);
  var dept = "بكل الأقسام";
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    return formattedDay + "-" + formattedMonth + "-" + year;
  }
  const handleOnLoad = () => {
    setLoading(false);
  };
  const fetchDataTable = async () => {
    setLoading(true);
    if (startDate && endDate) {
      const _startDate = new Date(
        startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
      const _endDate = new Date(
        endDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
      const formattedStartDate = formatDate(_startDate);
      const formattedEndDate = formatDate(_endDate);
      fetch(
        "/api/mahgoozfatra?StartDate=" +
          formattedStartDate +
          "&EndDate=" +
          formattedEndDate +
          "&Options=" +
          selectedOption.value +
          "&QueryType=" +
          (aqsamOrMosts === "mosts" ? 1 : 0)
      )
        .then((response) => {
          response.json().then((res) => {
            setRows(res.data);
            setSelectedOptionStatic(selectedOption.value);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } 
  };

  const setReportType = (type) => {
    setAqsamOrMosts(type);
    setRows([]);
  };
  return (
    <div
      style={{
        padding: 65,
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-x",
      }}
    >
      {/* heeee */}
      <div style={{ paddingInline: "15%" }}>
        <div id="pdf-container">
          <h1 style={{ marginBottom: 20, color: "#31304d" }}>
            تقرير المحجوزين بالمجمع
            <br /> خلال فترة
          </h1>
          <FromTo
            setStartDateTwo={setStartDate}
            setEndDateTwo={setEndDate}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            mode={aqsamOrMosts}
          />
          <div
            style={{
              zIndex: 1,
              position: "absolute",
              top: 0,
              marginTop: "11%",
              marginLeft: "20%",
            }}
          >
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                أقــســام أم مستشفــيــات
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="aqsam"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="mosts"
                  control={<Radio />}
                  label="مستشفــيــات"
                  onClick={() => setReportType("mosts")}
                />
                <FormControlLabel
                  value="aqsam"
                  control={<Radio />}
                  label="أقــــــســــــام"
                  onClick={() => setReportType("aqsam")}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div
            style={{
              alignSelf: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                backgroundColor: "#F0ECE5",
                color: "#161A30",
                marginTop: 50,
                fontWeight: "bold",
                width: "83%",
              }}
              onClick={fetchDataTable}
              variant="contained"
              disabled={!(startDate && endDate) || loading}
            >
              اظهر البيانات
            </Button>
          </div>

          <br></br>
          <br></br>
          <br></br>

          {rows.length > 0 ? (
            <div>
              <DynamicPDFViewer
                showToolbar={true}
                width="100%"
                height="720px"
                onLoad={handleOnLoad}
              >
                {selectedOptionStatic === "0-الكل"
                  ? (dept = "كل الأقسام")
                  : (dept = selectedOptionStatic.split("-")[1])}
                {aqsamOrMosts === "aqsam" ? (
                  <MyDocument2
                    data={rows}
                    title={`بيان بالمحجوزين حاليا بـ${dept} داخل المجمع الطبي ق.م بكوبري القبة`}
                  />
                ) : (
                  <MyDocument
                    data={rows}
                    title={`بيان بالمحجوزين حاليا بـ${dept} داخل المجمع الطبي ق.م بكوبري القبة`}
                  />
                )}
              </DynamicPDFViewer>
            </div>
          ) : (
            <div>{loading ? <CircularProgress /> : "لا توجد احصائية"}</div>
          )}
        </div>
      </div>
    </div>
  );
}
