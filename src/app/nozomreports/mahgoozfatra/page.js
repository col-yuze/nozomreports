"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import Button from "@mui/material/Button";
import FromTo from "../../../components/FromTo";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
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

  const [selectedOption, setSelectedOption] = useState("0-الكل");
  // prettier-ignore
  const [endDate, setEndDate] = React.useState(null);

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    return formattedDay + "-" + formattedMonth + "-" + year;
  }

  // api fetching

  const fetchDataTable = async () => {
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

  const toggleVisibility = () => {
    setShow(!show);
    fetchDataTable();
  };

  React.useEffect(() => {
    let isMounted = true; // Variable to check if the component is still mounted
    if (isMounted) {
      fetchDataTable();
    }

    return () => {
      // Cleanup function to set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    console.log(selectedOption, "nader");
  }, [selectedOption]);

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
            mode="1"
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
              variant="contained"
              onClick={toggleVisibility}
            >
              اظهر البيانات
            </Button>
          </div>
          <br></br>
          <br></br>
          <br></br>

          {rows.length > 0 ? (
            <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
              <MyDocument
                data={rows}
                title={
                  "بيان بالمحجوزين حاليا داخل المجمع الطبي ق.م بكوبري القبة"
                }
              />
            </DynamicPDFViewer>
          ) : (
            <div style={{ height: 500 }}></div>
          )}
        </div>
      </div>
    </div>
  );
}
