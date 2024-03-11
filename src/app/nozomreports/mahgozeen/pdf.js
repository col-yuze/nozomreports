import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import NotoNaskh from "../../../styles/ReadexPro-VariableFont_HEXP,wght.otf";
// Register the custom font
Font.register({ family: "NotoNaskh", src: NotoNaskh });

// Define styles
const departments = [
  "الكل",
  "مستشفى الجراحة",
  "مستشفى الباطنة",
  "مستشفى الجهاز التنفسي",
  "مستشفى الاسنان التخصصي",
  "الاستقبال و الطوارئ و الحوادث",
  "مستشفى الكلى",
  "مستشفى القلب التخصصي",
  "مستشفى العيون التخصصي",
  "السموم",
];
const styles = StyleSheet.create({
  page: {
    flexDirection: "row-reverse",
    backgroundColor: "#ffffff",
    fontFamily: "NotoNaskh",
    padding: "20px 10px",
    orientation: "landscape",
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
    marginBottom: 15,
    alignSelf: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
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

const rowsPerPageTitled = 29; // Adjusted for the first page which includes the title
const rowsPerPage = 33; // For subsequent pages
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = dd + "-" + mm + "-" + yyyy;
const MyDocument = ({ data, title }) => {
  // Your helper functions and logic remain unchanged

  // Dynamically split data into pages considering different row limits
  const pagesData = [];
  let index = 0;
  let isFirstPage = true;
  //console.log(data[0][1].slice(0, 1));
  const titlePages = [];
  for (let j = 0; j < data.length; j++) {
    isFirstPage = true;
    if (data[j][1].length > 0) {
      titlePages.push(pagesData.length);
      var arrayTop = [
        [departments[data[j][0]], "العدد", data[j][1].length - 1],
      ];
      while (index < data[j][1].length) {
        const limit = isFirstPage ? rowsPerPageTitled : rowsPerPage;
        var arr = [];
        //if (index == 0)
        arr = arrayTop.concat(data[j][1].slice(index, index + limit));
        //else arr = data[j][1].slice(index, index + limit);
        pagesData.push(arr);

        index += limit;
        isFirstPage = false; // Only the first chunk uses rowsPerPageTitled
      }
      index = 0;
    }
  }
  console.log(today);
  console.log(typeof today);
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
            {/* {titlePages.includes(pageIndex) && (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>KOKI</Text>
              </View>
            )} */}
            <View style={styles.table}>
              {pageData.map((rowData, index) => (
                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        index === 1 && titlePages.includes(pageIndex)
                          ? "#d4d8dd"
                          : index === 0 && titlePages.includes(pageIndex)
                          ? "#e1e1e1"
                          : "white",
                    },
                  ]}
                  key={index}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <View
                      style={[
                        styles.cell,
                        {
                          fontSize: "7px",
                          flex:
                            cellIndex === 2
                              ? "2.5"
                              : cellIndex === 0
                              ? "0.15"
                              : cellIndex === 4
                              ? "1.2"
                              : cellIndex === 3
                              ? "0.6"
                              : cellIndex === 1
                              ? "0.6"
                              : "0.9",
                        },
                        index === 0 //&& titlePages.includes(pageIndex)
                          ? {
                              paddingTop: "15px",
                              paddingBottom: "15px",
                              fontSize: "12px",
                              flex:
                                cellIndex === 0
                                  ? "3.425"
                                  : cellIndex === 1
                                  ? "1.875"
                                  : "0.875",
                            }
                          : null,
                        cellData.toString() === today
                          ? { backgroundColor: "#e1e1e1" }
                          : null,
                      ]}
                      key={cellIndex}
                    >
                      <Text style={{ fontSize: "7px" }}>
                        {cellData.toString()}
                      </Text>
                    </View>
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
