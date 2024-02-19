"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import MyDocument from "./pdf";
import dynamic from "next/dynamic";
// Load PDFDownloadLink and PDFViewer dynamically to ensure they're only executed on the client-side
const DynamicPDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFDownloadLink),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function Nesbestashghal() {
  const [rows, setRows] = React.useState([]);
  // api fetching
  const fetchDataTable = async () => {
    fetch("/api/nesba")
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data); // Set the state with the modified rows
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
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>نسبة الاشغال</h1>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px auto",
          }}
        >
          <DynamicPDFDownloadLink
            document={<MyDocument data={rows} />}
            fileName={`نسبة الأشغال عن يوم ${new Date().toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            )} - ${new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`}
          >
            {({ blob, url, loading, error }) =>
              loading ? "wait Loading document..." : "Save as PDF"
            }
          </DynamicPDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
