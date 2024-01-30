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
const rows = [
  {
    name: "row1",
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    name: "row2",
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    name: "row3",
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  { name: "row4", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: "row5", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: "row6", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: "row7", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: "row8", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];

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
export default function Nesbestashghal() {
  return (
    <div style={{ padding: 50 }}>
      <div style={{ paddingInline: "15%" }}>
        <div id="pdf-container">
          <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>نسبة الاشغال</h1>
          <TableContainer
            component={Paper}
            style={{ backgroundColor: "#F0ECE5" }}
          >
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
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell scope="row">{row.name}</TableCell>
                    {row.data.map((el, index) => (
                      <TableCell key={index} align="center">
                        {el}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
