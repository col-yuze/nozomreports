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
export default function KoshofatEyadat() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState();
  const [staticStartDate, setStaticStartDate] = useState();
  const [loading, setLoading] = useState(false);
  // api fetching
  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/koshofateyadat?datein=${startDate}`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setStaticStartDate(startDate);
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
    <>
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
              {`تقرير بداية العمل في العيادات عن يوم`}
            </h1>
            <br />
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
              <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
                <MyDocument
                  data={rows}
                  onLoad={handleOnLoad}
                  title={`تقرير بداية العمل في العيادات عن يوم ${staticStartDate}`}
                />
              </DynamicPDFViewer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}