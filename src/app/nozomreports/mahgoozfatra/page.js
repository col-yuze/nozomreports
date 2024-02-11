"use client"; // this part for handle click and error for client/server issues
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FromTo from "../../../components/FromTo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Nesbestashghal() {
  const [rows, setRows] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const toggleVisibility = () => {
    setShow(!show);
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
  console.log("satrt" + startDate + " end " + endDate);

  // api fetching
  const fetchDataTable = async () => {
    fetch("/api/nesba")
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
      //   fetchDataTable();
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
          <h1 style={{ marginBottom: 20, color: "#31304d" }}>
            تقرير المحجوزين بالمجمع
            <br /> خلال فترة
          </h1>
          <FromTo setStartDateTwo={setStartDate} setEndDateTwo={setEndDate} />
          <div style={{ alignSelf: "center" }}>
            <Button
              style={{
                backgroundColor: "#F0ECE5",
                color: "#161A30",
                marginTop: 100,
                fontWeight: "bold",
              }}
              variant="contained"
              onClick={toggleVisibility}
            >
              اظهر البيانات
            </Button>
          </div>

          {rows.length <= 0 && !show ? (
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
            <TableContainer
              component={Paper}
              style={{ backgroundColor: "#F0ECE5" }}
            >
              <h3>شــكـــوكـــو</h3>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableCell align="center" key={index}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell scope="row" key={index} />
                      {row.map((el, index) => {
                        if (index !== 0) {
                          return (
                            <TableCell key={index} align="center">
                              {el}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        </div>
      </div>
    </div>
  );
}
