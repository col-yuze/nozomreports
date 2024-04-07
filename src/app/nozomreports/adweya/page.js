"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import { Button, CircularProgress } from "@mui/material";
import FromToII from "../../../components/FromToII";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function Adweya() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateStatic, setStartDateStatic] = useState();
  const [endDateStatic, setEndDateStatic] = useState();
  const [loading, setLoading] = useState(false);
  // api fetching

  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/adweya?param1=${startDate}&param2=${endDate}`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setEndDateStatic(endDate);
          setStartDateStatic(startDate);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleOnLoad = () => {
    setLoading(false);
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
      <div style={{ paddingInline: "15%" }}>
        <div id="pdf-container">
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
            الأدوية المطلوب صرفها خلال فترة
          </h1>
          <div
            style={{
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FromToII
              setStartDateTwo={setStartDate}
              setEndDateTwo={setEndDate}
              two="true"
            />
            <br />
            <Button
              style={{
                backgroundColor: "#F0ECE5",
                color: "#161A30",
                marginTop: 50,
                marginBottom: 50,
                fontWeight: "bold",
                width: "100%",
              }}
              onClick={fetchDataTable}
              variant="contained"
              disabled={!(startDate && endDate) || loading}
            >
              اظهر البيانات
            </Button>
          </div>
          {rows.length <= 0 || !startDate || !endDate ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
              }}
            >
              {loading ? <CircularProgress /> : "لا توجد احصائية"}
            </div>
          ) : (
            <DynamicPDFViewer
              showToolbar={true}
              width="100%"
              height="720px"
              onLoad={handleOnLoad}
            >
              <MyDocument
                data={rows}
                title={`
                احصائية بأدوية المرتبات العلاجية المطلوب صرفها خلال الفترة من ${startDateStatic} الي ${endDateStatic}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
