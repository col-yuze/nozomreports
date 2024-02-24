"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function AdweyaRamad() {
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState("2-2-2023");
  const [endDate, setEndDate] = useState("5-2-2023");
  // api fetching
  const fetchDataTable = async () => {
    fetch(`/api/adweyaramad?fdate=01-01-2024&tdate=01-01-2024`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          console.log(res.data);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  React.useEffect(() => {
    let isMounted = true; // Variable to check if the component is still mounted
    if (isMounted) {
      fetchDataTable();
    }

    return () => {
      // Cleanup function to set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, []);

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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>ادوية رمد</h1>
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
                title={`احصائية عددية لعيادات الرمد للفترة من ${startDate} الي ${endDate}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
