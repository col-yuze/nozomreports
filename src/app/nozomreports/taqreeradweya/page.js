"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
import MyDocument2 from "./pdf";
import { CircularProgress } from "@mui/material";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function AadadMotaha() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = React.useState("20-03-2024");
  const [staticStartDate, setStaticStartDate] = React.useState(startDate);
  const [hosp, setHosp] = React.useState(0);
  const [queryType, setQueryType] = React.useState(1);
  const [dept, setDept] = React.useState(200534);
  const [room, setRoom] = React.useState("جر 106");
  // api fetching
  const fetchDataTable = async () => {
    // fetch(`/api/rooms?deptin=200534`).then((response) =>
    //   response.json().then((res) => {
    //   })
    // );
    // fetch(`/api/departments?hospin=1`).then((response) =>
    //   response.json().then((res) => {})
    // );
    setLoading(true);
    fetch(
      `/api/taqreeradweya?datein=${startDate}&deptin=${dept}&roomin=${room}&querytype=${queryType}`
    )
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
            تقرير الادوية المنصرفة لصالح قسم دخلي
          </h1>
          {rows.length <= 0 ? (
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
              {queryType == 1 ? (
                <MyDocument
                  data={rows}
                  title={`الادويةالمنصرفة لصالح قسم ${dept} ${room}`}
                />
              ) : (
                <MyDocument2
                  data={rows}
                  title={`الادويةالمنصرفة لصالح قسم ${dept} ${room}`}
                />
              )}
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
