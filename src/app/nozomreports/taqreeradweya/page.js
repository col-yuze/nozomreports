"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
import MyDocument2 from "./pdf";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dropdown from "react-dropdown";

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
  const [queryType, setQueryType] = React.useState(1);
  const [startDate, setStartDate] = React.useState(null);
  const [staticStartDate, setStaticStartDate] = React.useState(null);
  const [hosp, setHosp] = React.useState(0);
  const [dept, setDept] = React.useState(0);
  const [deptStatic, setDeptStatic] = React.useState(0);
  const [room, setRoom] = React.useState(0);
  const [roomStatic, setRoomStatic] = React.useState(0);

  ///testing
  const [hospArr, setHospArr] = React.useState([
    "1-مستشفى الجراحة",
    "2-مستشفى الباطنة",
    "3-مستشفى الجهاز التنفسي",
    "4-مستشفى الاسنان التخصصي",
    "5-الاستقبال و الطوارئ و الحوادث",
    "6-مستشفى الكلى",
    "7-مستشفى القلب التخصصي",
    "8-مستشفى العيون التخصصي",
    "9-السموم",
  ]);
  const [qesmArr, setQesmArr] = React.useState([]);
  const [ghorfaArr, setGhorfaArr] = React.useState([]);
  //
  const fetchDataAqsamInHosp = async (hosp) => {
    await fetch(`/api/departments?hospin=${hosp.split("-")[0]}`)
      .then((response) => {
        response.json().then((res) => {
          setQesmArr(res.data);
        });
      })
      .catch((err) => console.error(err));
  };

  const fetchDataGhorafInQesm = async (dept) => {
    await fetch(`/api/rooms?deptin=${dept}`)
      .then((response) => {
        response.json().then((res) => {
          setGhorfaArr(res.data);
        });
      })
      .catch((err) => console.error(err));
  };
  //
  const onSelectHosp = (selectedValue) => {
    fetchDataAqsamInHosp(selectedValue.value);
    setHosp(selectedValue.value);
    setRoom(0);
    setDept(null);
  };
  const onSelectQesm = (selectedValue) => {
    setDept(selectedValue);
    setRoom(0);
    fetchDataGhorafInQesm(selectedValue.value[1]);
  };
  const onSelectGhorfa = (selectedValue) => {
    setRoom(selectedValue);
  };
  const handleOnLoad = () => {
    setLoading(false);
  };
  ///
  // api fetching
  const fetchDataTable = async (qt) => {
    // fetch(`/api/rooms?deptin=200534`).then((response) =>
    //   response.json().then((res) => {
    //   })
    // );
    // fetch(`/api/departments?hospin=1`).then((response) =>
    //   response.json().then((res) => {})
    // );
    setLoading(true);
    fetch(
      `/api/taqreeradweya?datein=${startDate}&deptin=${dept.value[1]}&roomin=${
        room == 0 ? 0 : room.value[1]
      }&querytype=${qt}`
    )
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
          setStaticStartDate(startDate);
          setDeptStatic(dept.value[0]);
          setRoomStatic(room == 0 ? "كل الغرف" : room.value[1]);
          setQueryType(qt);
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
              mode="11"
              hospOptions={hospArr}
              onHospChange={onSelectHosp}
              hospValue={hosp}
              qesmOptions={qesmArr}
              onQesmChange={onSelectQesm}
              qesmValue={dept}
              ghorfaOptions={ghorfaArr}
              onGhorfaChange={onSelectGhorfa}
              ghorfaValue={room}
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
              onClick={() => {
                fetchDataTable(1);
              }}
              variant="contained"
              disabled={!(startDate && hosp && dept) || loading}
            >
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
              onClick={() => {
                fetchDataTable(2);
              }}
              variant="contained"
              disabled={!(startDate && hosp && dept) || loading}
            >
              طباعة تقــريـر تـفـصـيـلـي
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
              {loading ? <CircularProgress /> : "لا يوجد احصائية"}
            </div>
          ) : (
            <DynamicPDFViewer
              showToolbar={true}
              width="100%"
              height="720px"
              onLoad={handleOnLoad}
            >
              {queryType == 1 ? (
                <MyDocument
                  data={rows}
                  title={`الادويةالمنصرفة لصالح قسم ${deptStatic} ${roomStatic} في ${staticStartDate}`}
                />
              ) : queryType == 2 ? (
                <MyDocument2
                  data={rows}
                  title={`الادويةالمنصرفة لصالح قسم ${deptStatic} ${roomStatic} في ${staticStartDate}`}
                />
              ) : null}
            </DynamicPDFViewer>
          )}
        </div>
      </div>
    </div>
  );
}
