"use client"; // this part for handle click and error for client/server issues
///////nneeeeds to be looked at and look at api
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import FromToII from "@/components/FromToII";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function Mahgozeen() {
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [staticStartDate, setStaticStartDate] = useState();

  const [num, setNum] = useState(10);
  const [staticNum, setStaticNum] = useState(10);

  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    //taree5 3adad rotba ta5asos
    fetch(
      `/api/sarfmoratabatten?datein=${startDate}&count=${num}`
    )
      .then((response) => {
        response.json().then((res) => {
          setStaticStartDate(startDate)
          setRows(res.data);
          setStaticNum(num)
        });
      })
      .catch((err) => {
        console.error(err);
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
            {`تقرير بصارفي مرتبات اكثر من ${staticNum}`}
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
              two="number"
              setNumTwo={setNum}
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
              onClick={fetchDataTable}
              disabled={!(startDate&&num)}
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
              <MyDocument
                data={rows}
                title={` ${staticStartDate}بيانات المرضي صارفي المرتبات العلاجية اكثر من ${staticNum} دواء منذ `}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
