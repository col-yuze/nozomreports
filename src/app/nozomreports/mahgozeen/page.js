"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";

import { CircularProgress } from "@mui/material";
import FromTo from "../../../components/FromTo";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function Mahgozeen() {
  const [rows, setRows] = useState([]);
  var dept = "بكل الأقسام";
  const [loading, setLoading] = useState(false);

  var dept = "بكل الأقسام";
  const [selectedOption, setSelectedOption] = useState("0-الكل");
  const [selectedOptionStatic, setSelectedOptionStatic] = useState();
  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/mahgozeen?buildnumber=${selectedOption[0]}`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setSelectedOptionStatic(selectedOption);
          // res.data[hospital][hosp_data]
          // console.log(res.data[0][1]);
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
            المحجوزيـــن بالمجمع حاليا
          </h1>
          <div
            style={{
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FromTo
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              mode="7"
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
            >
              اظهر البيانات
            </Button>
          </div>
          {rows?.length <= 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
              }}
            >
              {loading ? <CircularProgress /> : null}
            </div>
          ) : (
            <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
              {selectedOptionStatic === "0-الكل"
                ? (dept = "كل الأقسام")
                : (dept = selectedOptionStatic.substring(2))}
              <MyDocument
                data={rows}
                title={`بيان بالمحجوزين حاليا بـ${dept} 
                بالمجمع الطبى ق.م بكوبري القبة`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
