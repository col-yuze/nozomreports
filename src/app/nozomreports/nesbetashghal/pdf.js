import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
Font.register({ family: 'Roboto', src: source });
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
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
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  cell: {
    width: '100%',
    textAlign: 'center',
    padding: 8,
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

const MyDocument = () => {
  // Dummy data for table
  const numRows = 11;
  const numCols = 22;

  const renderRow = (rowData) => (
    <View style={styles.row}>
      {rowData.map((cell, colIndex) => (
        <Text key={colIndex} style={styles.cell}>
          {cell}
        </Text>
      ))}
    </View>
  );

  const renderFirstRow = () => (
    <View style={styles.row}>
      {[...Array(numCols)].map((_, index) => (
        <Text key={index} style={styles.cell}>
          {index + 1}
        </Text>
      ))}
    </View>
  );

  const renderTable = () => {
    const tableData = Array.from({ length: numRows - 1 }, () =>
      Array.from({ length: numCols }, () => 'nader')
    );

    return (
      <View style={styles.table}>
        {renderFirstRow()}
        {tableData.map((rowData, index) => (
          <React.Fragment key={index}>{renderRow(rowData)}</React.Fragment>
        ))}
      </View>
    );
  };

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
          {renderTable()}
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
