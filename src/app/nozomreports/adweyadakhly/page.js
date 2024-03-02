"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
import FromTo from "../../../components/FromTo";
import { Button } from "@mui/material";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function AdweyaDakhly() {
  const [rows, setRows] = useState([]);

  const [show, setShow] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState("0");

  // api fetching
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    return formattedDay + "-" + formattedMonth + "-" + year;
  }
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
      fetch(`/api/adweyadakhly?dept=200540&date=18-02-2024`)
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
      console.log("nader and filo");
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
      <div style={{ paddingInline: "15%" }}>
        <div id="pdf-container">
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
            الادوية المنصرفة للقسم الداخلي
          </h1>

          <div
            style={{
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FromTo
              setStartDateTwo={setStartDate}
              setEndDateTwo={setEndDate}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              mode="2"
            />
            <br />
            <Button
              style={{
                backgroundColor: "#F0ECE5",
                color: "#161A30",
                marginTop: 50,
                fontWeight: "bold",
              }}
              variant="contained"
            >
              اظهر البيانات
            </Button>
          </div>
          {rows.length <= 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
              }}
            >
              {" "}
            </div>
          ) : (
            <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
              <MyDocument data={rows} title="الادوية المنصرفة لصالح قسم" />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
