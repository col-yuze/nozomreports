"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";

import FromTo from "../../../components/FromTo";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function AadadMotaha() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [staticStartDate, setStaticStartDate] = React.useState(null);
  const [hosp, setHosp] = React.useState(0);
  const [dept, setDept] = React.useState(0);
  const [deptStatic, setDeptStatic] = React.useState(0);
  const [room, setRoom] = React.useState(null);
  const [roomStatic, setRoomStatic] = React.useState(0);
  var visibleTitle = "قسم";
  var qt = 0;
  // api fetching
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(
      `/api/taqreeradweya?fdate=${startDate}&op1=${hosp}&op2=${dept}&op3=${room}&QueryType=${qt}`
    )
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setStaticStartDate(startDate);
          setDeptStatic(dept);
          setRoomStatic(room);
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
            تقرير الادوية المنصرفة لصالح قسم داخلي
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
              setSelectedOption={setHosp}
              setSelectedOptionII={setDept}
              setSelectedOptionIII={setRoom}
              two="11"
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
              disabled={!(startDate && room)}
            >
              {(qt = 0)}
              طباعة تقــريـر اجمــالـــي
            </Button>
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
              disabled={!(startDate && room)}
            >
              طباعة تقــريـر تـفـصـيـلـي
              {(qt = 1)}
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
              {loading ? <CircularProgress /> : null}
            </div>
          ) : (
            <DynamicPDFViewer showToolbar={true} width="100%" height="720px">
              <MyDocument
                data={rows}
                title={`الادويةالمنصرفة لصالح قسم ${dept} ${room}`}
              />
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
