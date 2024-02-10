"use client"; // this part for handle click and error for client/server issues
import * as React from "react";

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
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px auto",
          }}
        ></div>
      </div>
    </div>
  );
}
