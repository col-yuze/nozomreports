import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    width: '100%',
    marginBottom: 20,
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    border:"1px solid black",
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
  },
  cell: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: 5,
    border:"1px black solid"
  },
  headerCell1: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    flex: 1,
    border:"1px black solid"
  },
  headerCell2: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    flex: 2,
    border:"1px black solid"
  },
  headerCell3: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    flex: 3,
    border:"1px black solid"
  },
   signatureContainer: {
    display: 'flex',
    flexDirection: "row",
    justifyContent:"space-around",
    marginTop: 20,
  },
  signature: {
    fontSize:10,
    marginBottom: 10,
  },
});

const MyDocument = ({ data }) => {
  const getBackgroundColor = (rowIndex,colIndex) => {
    if (rowIndex === 9) {
      if (colIndex === 0 || colIndex === 20 || colIndex === 21 || colIndex === 19) {
        return '#ffe0e0'
      }
      else if (colIndex === 1 || colIndex === 2 || colIndex === 3 || colIndex === 4 || colIndex === 5) {
        return '#e1e1e1'
      }
      else {
        return "#e0ffff"
      }
    }
    else {
      if (colIndex === 4 || colIndex === 5 || colIndex === 20 || colIndex === 19) {
        return '#e0ffff'
      }
      else if (colIndex===21) {
        return '#e1e1e1'
      }
      else {
        return 'white'
      }
    }
  }
const renderRow = (rowData, rowIndex) => (
  <View style={styles.row} key={rowIndex}>
    {rowData.map((cellData, colIndex) => (
      <Text style={[styles.cell, { backgroundColor:getBackgroundColor(rowIndex,colIndex)}]} key={colIndex}>
        {cellData}
      </Text>
    ))}
  </View>
);


  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell1, { backgroundColor:'#ffe0e0'}]}>hospitals</Text>
        <Text style={[styles.headerCell1, { backgroundColor:'#e1e1e1'}]}>total beds</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>stored beds</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>working beds</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>dobat</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>drgat</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>dobat fam</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>drgat fam</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>madny</Text>
        <Text style={[styles.headerCell2, { backgroundColor:'#e1e1e1'}]} colSpan={2}>morafk</Text>
        <Text style={[styles.headerCell1, { backgroundColor:'#e1e1e1'}]}>busy beds</Text>
        <Text style={[styles.headerCell3, { backgroundColor:'#ffe0e0'}]} colSpan={3}>ash8al</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.cell, { backgroundColor:'#ffe0e0'}]}></Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}></Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#e1e1e1'}]}></Text>
        <Text style={[styles.cell, { backgroundColor:'#ffe0e0'}]}>stay</Text>
        <Text style={[styles.cell, { backgroundColor:'#ffe0e0'}]}>icu</Text>
        <Text style={[styles.cell, { backgroundColor:'#ffe0e0'}]}>total</Text>
      </View>
    </View>
  );

  // Dummy data for signature
  const signatures = [
    { name: 'رئيسة تمريض المجمع السهرانة', signature: '' },
    { name: 'رئيس قسم شئون المرضى', signature: '' },
    { name: 'مساعد المدير للشئون الطبية والعلاجية', signature: 'عميد ط/ وليد يوسف العزيزي' },
    { name: 'مدير المجمع الطبي ق.م بك القبة', signature: 'لواء ط/ علاء الدين فتحي غيتة' },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={styles.timestamp}>2024-02-06 12:00 PM</Text>
          <Text style={styles.title}>Page Title</Text>
          <View style={styles.table}>
            {renderHeader()}
            {data.map((rowData, index) => renderRow(rowData, index))}
          </View>
          <View style={styles.signatureContainer}>
            {signatures.map(({ name, signature }, index) => (
              <View key={index} style={styles.signature}>
                <Text>{name}</Text>
                <Text>{signature}</Text>
                <Text>`(                                    )التوقيع`</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
