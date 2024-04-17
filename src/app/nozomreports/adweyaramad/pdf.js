import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import NotoNaskh from "../../../styles/NotoNaskhArabic-VariableFont_wght.otf";
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
    padding: "10px 10px",
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
  subTitle: {
    textAlign: "end", // Align to the far right
    fontSize: 14,
    textDecoration: "underline",
    textColor: "red",
  },

  subTitleContainer: {
    marginBottom: 10,
    alignSelf: "flex-end", // Align the container to the far right
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
    position: "absolute",
    bottom: 0,
    right: 200,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    width: "100%",
  },
  signature: {
    width: "180px",
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 800,
    textAlign: "right",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const rowsPerPageTitled = 10; // Adjusted for the first page which includes the title
const rowsPerPage = 15; // For subsequent pages
String.prototype.toIndiaDigits = function () {
  var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
  return this.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};
const MyDocument = ({ data, title }) => {
  // Your helper functions and logic remain unchanged
  // Dynamically split data into pages considering different row limits
  const pagesData = [];
  let index = 0;
  let isFirstPage = true;

  for (let j = 0; j < data.length; j++) {
    isFirstPage = true;
    if (data[j].length > 0) {
      var arrayTop = [];
      while (index < data[j].length) {
        const limit = isFirstPage ? rowsPerPageTitled : rowsPerPage;
        var arr = [];
        //if (index == 0)
        arr = arrayTop.concat(data[j].slice(index, index + limit));
        //else arr = data[j][1].slice(index, index + limit);
        pagesData.push(arr);

        index += limit;
        isFirstPage = false; // Only the first chunk uses rowsPerPageTitled
      }
      index = 0;
    }
  }

  const signatures = [
    {
      name: "لواء طبيب / ايــهاب فؤاد عبدالرحيم",
      signature: "مدير علاجى مستشفــي العيون التخصصى",
    },
  ];

  return (
    <Document>
      {pagesData.map((pageData, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.section}>
            {
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title.toIndiaDigits()}</Text>
              </View>
            }
            <View style={styles.subTitleContainer}>
              <Text style={styles.title}>
                {pageIndex === 0
                  ? "العيادات الخارجية لمست الرمد"
                  : pageIndex === 1
                  ? "العيادات التخصصية لمست الرمد"
                  : null}
              </Text>
            </View>
            <View style={styles.table}>
              {pageData.map((rowData, index) => (
                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        index === 0 && pageIndex < 2 ? "#e1e1e1" : "white",
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
                            index === 0 && cellIndex === 0 && pageIndex < 2
                              ? "20px"
                              : index === 0
                              ? "10px"
                              : "9px",
                          flex: cellIndex === 0 ? "3.5" : "1.3",
                          paddingTop:
                            index === 0 && cellIndex === 0 ? "10 px" : "auto",
                          backgroundColor:
                            (index === pageData.length - 1 &&
                              pageIndex === pagesData.length - 1) ||
                            (index === 6 && pageIndex === 0)
                              ? "#ffe0e0"
                              : cellIndex === rowData.length - 1
                              ? "#ffe0e0"
                              : "transparent",
                        },
                      ]}
                      key={cellIndex}
                    >
                      {cellData.toString().toIndiaDigits()}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.signatureContainer}>
              {signatures.map(({ name, signature }, index) => (
                <View key={index} style={styles.signature}>
                  <Text style={{ textAlign: "right" }}>( )التوقيع</Text>
                  <Text style={{ textAlign: "right" }}>{name}</Text>
                  <Text style={{ textAlign: "right" }}>{signature}</Text>
                  {/* prettier-ignore */}
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
