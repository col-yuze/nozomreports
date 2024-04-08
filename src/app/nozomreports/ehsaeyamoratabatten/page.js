"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import FromToII from "@/components/FromToII";
import { CircularProgress } from "@mui/material";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function EhsaeyaMoratabatten() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState(false);
  const [num, setNum] = React.useState(10);
  const [staticNum, setStaticNum] = useState(10);

  const headers = ["م", "عدد المرضى ", "عدد الادوية ", "الاجمالي"];
  // api fetching
  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/ehsaeyamoratabatten?datein=${startDate}&countin=${num}`)
      .then((response) => {
        response.json().then((res) => {
          setRows([headers, ...res.data]);
          setStaticNum(num);
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
              {`احصائيه اكثر من ${staticNum}`}
            </h1>
            <br />
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
                  title={`احصائية بالمرضى صارفى المرتبات العلاجية أكثر من ${staticNum}
                دواء منذ ${startDate} `}
                />
              </DynamicPDFViewer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
