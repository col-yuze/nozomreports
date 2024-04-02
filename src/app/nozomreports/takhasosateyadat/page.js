"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import { CircularProgress } from "@mui/material";
import FromToII from "../../../components/FromToII";
import Button from "@mui/material/Button";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function TakhasosatEyadat() {
  const [rows, setRows] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [staticStartDate, setStaticStartDate] = React.useState(null);
  const [staticEndDate, setStaticEndDate] = React.useState(null);

  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/takhasosateyadat?fdate=${startDate}&tdate=${endDate}`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setStaticStartDate(startDate);
          setStaticEndDate(endDate);
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
            احصائية العيادات تخصصات
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
              disabled={!(startDate && endDate) || loading}
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
            <DynamicPDFViewer
              showToolbar={true}
              width="100%"
              height="720px"
              onLoad={handleOnLoad}
            >
              <MyDocument
                data={rows}
                title={`احصائية عددية للفترة من ${staticStartDate} الي ${staticEndDate}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
