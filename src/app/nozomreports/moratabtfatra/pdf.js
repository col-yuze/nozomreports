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
const styles = StyleSheet.create({
  page: {
    flexDirection: "row-reverse",
    backgroundColor: "#ffffff",
    fontFamily: "NotoNaskh",
    padding: "10px 10px",
    orientation: "landscape",
  },
  section: {
    margin: 5,
    padding: "10px 10px",
    flexGrow: 1,
  },
  titleContainer: {
    width: "600px",
    padding: 0,
    backgroundColor: "#ffe0e0",
    marginBottom: 15,
    alignSelf: "center",
    paddingBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
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
    marginBottom: 30,
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

const rowsPerPageTitled = 30; // Adjusted for the first page which includes the title
const rowsPerPage = 33; // For subsequent pages

const MyDocument = ({ data, title }) => {
  // Dynamically split data into pages considering different row limits
  const pagesData = [];
  let index = 0;
  let isFirstPage = true;
  const titlePages = [];
  for (let j = 0; j < data.length; j++) {
    isFirstPage = true;
    if (data[j][1].length > 0) {
      titlePages.push(pagesData.length);
      var arrayTop = [[]];
      while (index < data[j][1].length) {
        const limit = isFirstPage ? rowsPerPageTitled : rowsPerPage;
        var arr = [];
        arr = arrayTop.concat(data[j][1].slice(index, index + limit));
        pagesData.push(arr);
        index += limit;
        isFirstPage = false; // Only the first chunk uses rowsPerPageTitled
      }
      index = 0;
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          {pagesData.map((pageData, pageIndex) => (
            <View style={styles.table} key={pageIndex}>
              {pageData.map((rowData, index) => (
                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        index === 1 && titlePages.includes(pageIndex)
                          ? "#e1e1e1"
                          : index === 2
                          ? "#ffe0e0"
                          : "white",
                    },
                  ]}
                  key={index}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontSize: "7px",
                          alignSelf: "center",
                        },
                        index === 0
                          ? {
                              paddingTop: "15px",
                              paddingBottom: "15px",
                              fontSize: "12px",
                              alignSelf: "center",
                            }
                          : null,
                      ]}
                      key={cellIndex}
                    >
                      {cellData.toString()}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
