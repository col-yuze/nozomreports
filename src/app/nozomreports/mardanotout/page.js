"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import MyDocument from "../../../components/pdf";
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export default function MardaNotOut() {
  const [rows, setRows] = useState([]);
  const itemsPerPage = 10; // Number of items per page

  const [startDate, setStartDate] = useState("2-2-2023");
  const [endDate, setEndDate] = useState("5-2-2023");
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, rows.length);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };
  const headers = [
    "",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "h7",
    "h8",
    "h9",
    "h10",
  ];
  // api fetching
  const fetchDataTable = async () => {
    fetch(`/api/mardanotout?datein=01-02-2024`)
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
  const handleSaveAsPDF = async () => {
    // Dynamically import html2pdf only on the client-side
    const html2pdf = (await import("html2pdf.js")).default;

    const content = document.getElementById("pdf-container");

    if (!content) {
      console.error("Could not find PDF container");
      return;
    }

    const pdfOptions = {
      margin: 10,
      filename: "table.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(content).set(pdfOptions).save();
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>ادوية عيادات</h1>
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
              <MyDocument data={rows} />
            </DynamicPDFViewer>
          )}
        </div>
        <div style={{ alignSelf: "center" }}>
          <Button
            style={{
              backgroundColor: "#F0ECE5",
              color: "#161A30",
              marginTop: 100,
              fontWeight: "bold",
            }}
            variant="contained"
            onClick={handleSaveAsPDF}
          >
            Save as PDF
          </Button>
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
