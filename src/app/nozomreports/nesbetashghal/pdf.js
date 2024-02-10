// this code was created in 9/2/2024 nabtshya just a week before i finished my militiry, if this can't inspire new soldiers to have the max disiplin to give all you can
// fe ay mkan enta tro7o mn 8er ma tb2a kaslan w mstny flos w bs mokabl ta3bk idk what can.
// made by: Mohammed Nader at the last week of his gesh, wasn't made with love but i enjoyed it anyway - ask about me though cus i made legacy here :)
// Mohammed Nader :)

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import NotoNaskh from "./NotoNaskhArabic-VariableFont_wght.ttf";

Font.register({ family: "NotoNaskh", src: NotoNaskh });

const styles = StyleSheet.create({
  page: {
    flexDirection: "row-reverse",
    backgroundColor: "#ffffff",
    fontFamily: "NotoNaskh",
    padding: "5px 10px",
  },
  section: {
    margin: 5,
    padding: "5px 10px",
    flexGrow: 1,
  },
  titleContainer: {
    width: "250px",
    borderRadius: "25%",
    padding: 5,
    backgroundColor: "#ffe0e0",
    marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    textDecoration: "underline",
  },
  timestamp: {
    textAlign: "right",
    fontSize: 12,
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
  headerRow: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  cell: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: 5,
    flex: 1,
  },
  headerCell1: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  headerCell2: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  headerCell3: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 3,
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
});

const MyDocument = ({ data }) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`; // dd/mm/yyyy format
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "مساءً" : "صباحًا";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (12 AM)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime = `${hours}:${minutes} ${ampm}`; // hh:mm AM/PM format
  const getBackgroundColor = (rowIndex, colIndex) => {
    if (rowIndex === 9) {
      if (
        colIndex === 0 ||
        colIndex === 20 ||
        colIndex === 21 ||
        colIndex === 19
      ) {
        return "#ffe0e0";
      } else if (
        colIndex === 1 ||
        colIndex === 2 ||
        colIndex === 3 ||
        colIndex === 4 ||
        colIndex === 5
      ) {
        return "#e1e1e1";
      } else {
        return "#e0ffff";
      }
    } else {
      if (
        colIndex === 4 ||
        colIndex === 5 ||
        colIndex === 20 ||
        colIndex === 19
      ) {
        return "#e0ffff";
      } else if (colIndex === 21) {
        return "#e1e1e1";
      } else if (colIndex === 0) {
        return "#ffffe0";
      } else {
        return "white";
      }
    }
  };

  String.prototype.toIndiaDigits = function () {
    var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
    return this.replace(/[0-9]/g, function (w) {
      return id[+w];
    });
  };

  const getCellData = (cellData, colIndex) => {
    if (colIndex === 0) {
      switch (cellData) {
        case 1:
          return "مستشفى الجراجة";
        case 2:
          return "مستشفى الباطنة";
        case 3:
          return "مستشفى الجهاز التنفسي";
        case 4:
          return "مستشفى الأسنان التخصصي";
        case 5:
          return "مستشفى الطوارئ والحوادث";
        case 6:
          return "مستشفى الكلى";
        case 7:
          return "مستشفى القلب التخصصي";
        case 8:
          return "مستشفى العيون التخصصي";
        case 9:
          return "السموم";
        default:
          return "الإجمالي";
      }
    } else {
      return cellData.toString().toIndiaDigits();
    }
  };

  const renderRow = (rowData, rowIndex) => (
    <View style={styles.row} key={rowIndex}>
      {rowData.map((cellData, colIndex) => (
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBackgroundColor(rowIndex, colIndex),
              borderLeft:
                (colIndex === 0 || colIndex % 2 != 0 || colIndex === 18) &&
                colIndex !== 19
                  ? "1px solid black"
                  : "",
              flex:
                colIndex === 0
                  ? "2.42"
                  : colIndex === 18
                  ? "1.7"
                  : colIndex === 19
                  ? "0.968"
                  : "1",
              fontSize: colIndex === 0 ? "8px" : "10px",
              borderTop: rowIndex === 9 ? "1px solid black" : "",
            },
          ]}
          key={colIndex}
        >
          {getCellData(cellData, colIndex)}
        </Text>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={[styles.headerRow, {}]}>
        <Text
          style={[
            styles.headerCell1,
            {
              backgroundColor: "#ffe0e0",
              flex: "1.995",
              borderLeft: "1px solid black",
            },
          ]}
        >
          المستشفى
        </Text>
        <Text
          style={[
            styles.headerCell1,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
        >
          طاقة الأسرة
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          اجمالي الأسرة المخزنة
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          اجمالي الأسرة العاملة
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          ضباط
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          درجات
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          عائلات ضباط
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          عائلات درجات
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          مدنيين
        </Text>
        <Text
          style={[
            styles.headerCell2,
            { backgroundColor: "#e1e1e1", borderLeft: "1px solid black" },
          ]}
          colSpan={2}
        >
          مرافقين
        </Text>
        <Text
          style={[
            styles.headerCell1,
            {
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
              flex: "1.5",
            },
          ]}
        >
          اجمالي الأسرة المشغولة
        </Text>
        <Text
          style={[styles.headerCell3, { backgroundColor: "#ffe0e0" }]}
          colSpan={3}
        >
          نسبة الأشغال
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#ffe0e0",
              flex: "2.42",
              borderLeft: "1px solid black",
            },
          ]}
        ></Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        ></Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#e1e1e1" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              borderLeft: "1px solid black",
            },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            {
              borderBottom: "1px solid black",
              backgroundColor: "#e1e1e1",
              flex: "1.7",
              borderLeft: "1px solid black",
            },
          ]}
        ></Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#ffe0e0" },
          ]}
        >
          إقامة
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#ffe0e0" },
          ]}
        >
          رعاية
        </Text>
        <Text
          style={[
            styles.cell,
            { borderBottom: "1px solid black", backgroundColor: "#ffe0e0" },
          ]}
        >
          إجمالي
        </Text>
      </View>
    </View>
  );

  // Dummy data for signature
  const signatures = [
    { name: "رئيسة تمريض المجمع السهرانة", signature: "" },
    { name: "رئيس قسم شئون المرضى", signature: "" },
    {
      name: "مساعد المدير للشئون الطبية والعلاجية",
      signature: "عميد ط/ وليد يوسف العزيزي",
    },
    {
      name: "مدير المجمع الطبي ق.م بك القبة",
      signature: "لواء ط/ علاء الدين فتحي غيتة",
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={styles.timestamp}>
            توقيت الطباعة : {formattedTime.toIndiaDigits()}
          </Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              نسبة الأشغال عن يوم : {formattedDate.toIndiaDigits()}
            </Text>
          </View>
          <View style={styles.table}>
            {renderHeader()}
            {data.map((rowData, index) => renderRow(rowData, index))}
          </View>
          <View style={styles.signatureContainer}>
            {signatures.map(({ name, signature }, index) => (
              <View key={index} style={styles.signature}>
                <Text style={{ textAlign: "right" }}>{name}</Text>
                <Text style={{ textAlign: "right" }}>{signature}</Text>
                <Text style={{ textAlign: "right" }}>( )التوقيع</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
