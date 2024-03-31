"use client"; // this part for handle click and error for client/server issues

///////nneeeeds to be looked at and look at api1`
import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import FromTo from "../../../components/FromTo";
import { Button } from "@mui/material";

import { CircularProgress } from "@mui/material";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function AdweyaDakhly() {
  const [rows, setRows] = useState([]);

  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState(false);
  const [startDateStatic, setStartDateStatic] = useState();
  const [selectedOptionStatic, setSelectedOptionStatic] = useState();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  // api fetching 200540
  const fetchDataTable = async () => {
    if (selectedOption === null) {
      return
    }
    setLoading(true);
    fetch(
      `/api/adweyadakhly?dept=${
        selectedOption.value.split("-")[0]
      }&date=${startDate}`
    )
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setSelectedOptionStatic(selectedOption.value);
          setStartDateStatic(startDate);
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
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              mode="8"
              setStartDateTwo={setStartDate}
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
              disabled={!(startDate && selectedOption) || loading}
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
                title={` الادوية المنصرفة لصالح  ${
                  selectedOptionStatic.split("-")[1]
                } عن يوم ${startDateStatic}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
