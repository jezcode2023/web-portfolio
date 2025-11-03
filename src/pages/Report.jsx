import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12 },
});

export default function Report({ analysis, passedStudents, failedStudents }) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>AI Analysis Report</Text>
          <Text style={styles.text}>{analysis}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Passed Students</Text>
          {passedStudents.map((name, i) => (
            <Text key={i} style={styles.text}>{name}</Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Failed Students</Text>
          {failedStudents.map((name, i) => (
            <Text key={i} style={styles.text}>{name}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}