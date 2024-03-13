"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import Button from "@mui/material/Button";
import FromTo from "../../../components/FromTo";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
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
  const [selectedOption, setSelectedOption] = useState("0-الكل");
  // prettier-ignore
  const [endDate, setEndDate] = React.useState(null);
  var modeOfAqsamOrMosts = "mosts";
  var dept = "بكل الأقسام";
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    return formattedDay + "-" + formattedMonth + "-" + year;
  }

  // api fetching
  function setAqsamOrMosts(AqsamOrMosts) {
    modeOfAqsamOrMosts = AqsamOrMosts;
    fetchDataTable();
  }
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
          selectedOption[0]
      )
        .then((response) => {
          response.json().then((res) => {
            setRows(res.data);
            console.log(res.data);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("shit");
    }
  };

  // const toggleVisibility = () => {
  //   setShow(!show);
  //   fetchDataTable();
  // };

  // React.useEffect(() => {
  //   let isMounted = true; // Variable to check if the component is still mounted
  //   if (isMounted) {
  //     fetchDataTable();
  //   }

  //   return () => {
  //     // Cleanup function to set isMounted to false when the component is unmounted
  //     isMounted = false;
  //   };
  // }, []);

  // React.useEffect(() => {
  //   console.log(selectedOption, "nader");
  // }, [selectedOption]);

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
            mode={modeOfAqsamOrMosts}
          />
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
              disabled={!(startDate && endDate)}
            >
              اظهر البيانات
            </Button>
          </div>
          <div>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                أقــســام أم مستشفــيــات
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="aqsamOrMosts"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="aqsamOrMosts"
                  control={<Radio />}
                  label="مستشفــيــات"
                  onClick={setAqsamOrMosts("mosts")}
                />
                <FormControlLabel
                  value="8"
                  control={<Radio />}
                  label="أقــســام"
                  onClick={setAqsamOrMosts("aqsam")}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <br></br>
          <br></br>
          <br></br>

          {rows.length > 0 ? (
            <div>
              <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
                {selectedOption === "0-الكل"
                  ? (dept = "كل الأقسام")
                  : (dept = selectedOption.substring(2))}

                <MyDocument
                  data={rows}
                  title={`بيان بالمحجوزين حاليا بـ${dept} داخل المجمع الطبي ق.م بكوبري القبة`}
                />
              </DynamicPDFViewer>
            </div>
          ) : (
            <div>{loading ? <CircularProgress /> : null}</div>
          )}
        </div>
      </div>
    </div>
  );
}
