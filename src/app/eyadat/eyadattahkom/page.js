"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "./pdf";
import { CircularProgress } from "@mui/material";
import FromToII from "../../../components/FromToII";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function EyadatTahkom() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  // api fetching
  const handleOnLoad = () => {
    setLoading(false);
    rows.length = 0;
  };
  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/aadadmotaha`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchUser = async () => {
    fetch(`/api/authentication?user_name=admin`)
      .then((response) => {
        response.json().then((res) => {
          console.log(res);
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
    // fetch data when page loads
    fetchDataTable();
  }, []);
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
              {`التحكم في العيادات`}
            </h1>
            <br />
            <div
              style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#F0ECE5",
                  color: "#161A30",
                  marginTop: 50,
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={fetchUser}
                variant="contained"
                disabled={loading}
              >
                login{" "}
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
                  onLoad={handleOnLoad}
                  title={`التحكم في العيادات`}
                />
              </DynamicPDFViewer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
