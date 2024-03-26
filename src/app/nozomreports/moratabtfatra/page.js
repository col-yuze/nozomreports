"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";

import { CircularProgress } from "@mui/material";
import FromToII from "../../../components/FromToII";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function MoratabtFatra() {
  const [rows, setRows] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [staticStartDate, setStaticStartDate] = useState();
  const [staticEndDate, setStaticEndDate] = useState();
  const [loading, setLoading] = useState(false);
  const [patientCode, setPatientCode] = useState(-1);
  // api fetching
  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(
      `/api/moratabtfatra?fdate=${startDate}&tdate=${endDate}&patientCode=${patientCode}`
    )
      .then((response) => {
        response.json().then((res) => {
          setStaticStartDate(startDate);
          setStaticEndDate(endDate);
          setRows(res.data);
          console.log(res.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>ادوية مرتبات</h1>
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
              isText={true}
              setText={setPatientCode}
            />
            <br />
            <Button
              style={{
                backgroundColor: "#F0ECE5",
                color: "#161A30",
                marginTop: 50,
                fontWeight: "bold",
              }}
              onClick={fetchDataTable}
              variant="contained"
              disabled={
                !(startDate && endDate && patientCode !== -1) || loading
              }
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
                احصائية من ${staticStartDate} الي ${staticEndDate}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
