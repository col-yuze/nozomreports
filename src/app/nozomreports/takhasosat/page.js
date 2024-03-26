/* eslint-disable react/jsx-no-undef */
"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import FromToII from "../../../components/FromToII";
import { CircularProgress } from "@mui/material";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function Takhasosat() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState(false);

  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/takhasosat?datein=${startDate}`)
      .then((response) => {
        response.json().then((res) => {
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
            {" "}
            احصائية الأدوية المنصرفة مرتبات علاجية تخصصات{" "}
          </h1>
          <div
            style={{
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FromToII setStartDateTwo={setStartDate} two="one" />
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
          {rows.length <= 0 || !startDate ? (
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
                 احصائية الأدوية المنصرفة مرتبات علاجية  تخصصات عن يوم ${startDate} `}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
