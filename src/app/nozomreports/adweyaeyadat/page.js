"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import FromToII from "../../../components/FromToII";
import { Button, CircularProgress } from "@mui/material";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function AdweyaEyadat() {
  const [rows, setRows] = useState([]);

  const [startDate, setStartDate] = useState();
  const [staticStartDate, setStaticStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [staticEndDate, setStaticEndDate] = useState();
  const [loading, setLoading] = useState(false);

  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/adweyaeyadat?fdate=${startDate}&tdate=${endDate}`)
      .then((response) => {
        response.json().then((res) => {
          setStaticStartDate(startDate);
          setStaticEndDate(endDate);
          setRows(res.data);
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
            احصائية العيادات اليومية
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
                fontWeight: "bold",
                width: "100%",
              }}
              onClick={fetchDataTable}
              variant="contained"
              disabled={!startDate || loading}
            >
              اظهر البيانات
            </Button>
            <br />
            <br />
          </div>
          {rows.length <= 0 || !staticStartDate ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
              }}
            >
              {loading ? <CircularProgress /> : "لا يوجد احصائية"}
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
                title={`إحصائية الادوية المنصرفة بالعيادات من ${staticStartDate} الي ${staticEndDate}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
