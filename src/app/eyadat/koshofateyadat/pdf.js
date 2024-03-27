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
import CamelFont from "../../../styles/TheYearofTheCamel-ExtraBold.otf";


// Register the custom font
Font.register({ family: "NotoNaskh", src: NotoNaskh });
Font.register({ family: "CamelFont", src: CamelFont });

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
    marginBottom: 15,
    alignSelf: "center",
    paddingBottom: 5,
  },
  timestamp: {
    textAlign: "right",
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "CamelFont",
    paddingBottom:5
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

const currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "مساءً" : "صباحًا";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (12 AM)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime = `${hours}:${minutes} ${ampm}`; // hh:mm AM/PM format
const rowsPerPageTitled = 20; // Adjusted for the first page which includes the title
const rowsPerPage = 22; // For subsequent pages

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

  // if its not the first page then add the title again
  pagesData.forEach((pageData, i) => {
    if (i !== 0) {
      return pageData.unshift(pagesData[0][0]);
    }
  });
  // changes from english to arabic
  String.prototype.toIndiaDigits = function () {
    var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
    return this.replace(/[0-9]/g, function (w) {
      return id[+w];
    });
  };
  return (
    <Document>
      {pagesData.map((pageData, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.section}>
            <div style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.timestamp}>
                توقيت الطباعة : {formattedTime.toIndiaDigits()}
              </Text>
              <Text
                style={
                  styles.timestamp
                }
              >
                فرع نظم المعلومات
              </Text>
            </div>

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
                      backgroundColor: index === 0 ? "#e1e1e1" : "white",
                    },
                  ]}
                  key={index}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontSize: index === 0 ? "12px" : "9px",
                          flex:
                            cellIndex === 2
                              ? "2"
                              : cellIndex === 1
                              ? "2"
                              : cellIndex === 0
                              ? "0.5"
                              : "1",

                          backgroundColor:
                            cellIndex === rowData.length - 1 || cellIndex === 0
                              ? "#ffe0e0"
                              : "transparent",
                        },
                      ]}
                      key={cellIndex}
                    >
                      {cellData}
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
