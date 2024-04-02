"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import { CircularProgress } from "@mui/material";
import FromTo from "../../../components/FromTo";
import Button from "@mui/material/Button";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function AdweyaMoratabat() {
  const [rows, setRows] = React.useState([]);
  const [startDate, setStartDate] = React.useState();
  const [staticStartDate, setStaticStartDate] = React.useState();
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [selectedOptionStatic, setSelectedOptionStatic] = React.useState();
  const [loading, setLoading] = React.useState(false);
  var showString = "الأدوية";
  // api fetching
  const handleOnLoad = () => {
    setLoading(false);
  };
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(
      `/api/adweyamoratabat?fdate=${startDate}&typein=${
        selectedOption.value.split("-")[0]
      }`
    )
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setStaticStartDate(startDate);
          setSelectedOptionStatic(selectedOption.value);
        });
      })
      .catch((err) => {
        console.error(err);
      })
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
            احصائية الادوية المنصرفة مرتبات علاجية
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
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              mode="10"
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
              disabled={!(startDate && selectedOption) || loading}
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
              {selectedOptionStatic === "3-عادى"
                ? (showString = "الأدوية")
                : (showString = "أدوية الصدر")}
              <MyDocument
                data={rows}
                title={`احصائية ب${showString} المنصرفة كمرتبات علاجية اعتبارا من ${staticStartDate}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
