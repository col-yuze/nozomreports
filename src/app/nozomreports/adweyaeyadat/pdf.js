import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import NotoNaskh from "../../../styles/TheYearofTheCamel-ExtraBold.otf";
// Register the custom font
Font.register({ family: "NotoNaskh", src: NotoNaskh });

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row-reverse",
    backgroundColor: "#ffffff",
    fontFamily: "NotoNaskh",
    padding: "20px 10px",
  },
  section: {
    margin: 5,
    padding: "20px 10px",
    flexGrow: 1,
  },
  titleContainer: {
    width: "600px",
    padding: 0,
    backgroundColor: "#ffe0e0",
    marginBottom: 10,
    alignSelf: "center",
    paddingBottom: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    paddingTop: 10,
    textDecoration: "underline",
  },
  esmElmogm3: {
    fontSize: 10,
    marginBottom: 5,
  },
  logoElmogm3: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    width: "100%",
    marginBottom: 5,
    fontSize: 10,
    border: "1px solid black",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  cell: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: 5,
    flex: 1,
    fontSize: 9,
    border: "1px solid black",
  },
  signatureContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginTop: 20,
  },
  signature: {
    width: "180px",
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 800,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const rowsPerPageTitled = 28; // Adjusted for the first page which includes the title
const rowsPerPage = 33; // For subsequent pages

const MyDocument = ({ data, title }) => {
  // Your helper functions and logic remain unchanged

  // Dynamically split data into pages considering different row limits
  const pagesData = [];
  let index = 0;
  let isFirstPage = true;

  while (index < data.length) {
    const limit = isFirstPage ? rowsPerPageTitled : rowsPerPage;
    pagesData.push(data.slice(index, index + limit));
    index += limit;
    isFirstPage = false; // Only the first chunk uses rowsPerPageTitled
  }

  return (
    <Document>
      {pagesData.map((pageData, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.section}>
            {pageIndex === 0 && (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
            )}
            <View style={styles.table}>
              {pageData.map((rowData, index) => (
                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        index === 0 && pageIndex === 0 ? "#e1e1e1" : "white",
                    },
                  ]}
                  key={index}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontSize:
                            index === 0 && cellIndex === 0 && pageIndex === 0
                              ? "25px"
                              : index === 0 && pageIndex === 0
                              ? "10px"
                              : "8px",
                          flex: cellIndex === 0 ? "4" : "0.5",
                          paddingTop:
                            index === 0 && cellIndex === 0 && pageIndex === 0
                              ? "17px"
                              : "auto",
                          backgroundColor:
                            index === pageData.length - 1 &&
                            pageIndex === pagesData.length - 1
                              ? "#ffe0e0"
                              : cellIndex === rowData.length - 1
                              ? "#ffe0e0"
                              : "transparent",
                        },
                      ]}
                      key={cellIndex}
                    >
                      {cellData.toString().includes("عقيد")
                        ? "صيدلية عقيد / مقدم / رائد"
                        : cellData.toString().includes("ملازم")
                        ? "صيدلية ملازم / ملازم أول / نقيب"
                        : cellData.toString()}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MyDocument;
