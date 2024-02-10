const {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} = require("../../lib/db");

export default async function handler(req, res) {
  let connection;

  try {
    connection = await connectToDatabase();

    // Your database queries or operations go here

    const query = `
            SELECT  SPECIALISIM.M_SPEC_CODE,CLINIC.SPECIALISIM_CODE,V_CLINIC_NAME.CLINIC_CODE,V_CLINIC_NAME.CLINIC_OUT_NAME,CLINIC.TR_P_NUM
        FROM    V_CLINIC_NAME,CLINIC,SPECIALISIM
        WHERE   V_CLINIC_NAME.CLINIC_CODE = CLINIC.CLINIC_CODE
        AND      CLINIC.SPECIALISIM_CODE = SPECIALISIM.SPECIALISIM_CODE 
        AND       V_CLINIC_NAME.CLINIC_OUT_NAME NOT LIKE '%معطل%'
        AND      CLINIC.TR_P_NUM > 0
        AND       V_CLINIC_NAME.CLINIC_CODE NOT IN (20029110001,20029130001,20029140001,20029150001,20024110001,20078140001,
        20093130001,20093140001,20093150001,20093160001,20093170001,20093180001,
        20093190001,20002120001,10000000000,20044210001
        )
        ORDER BY SPECIALISIM.M_SPEC_CODE,CLINIC.SPECIALISIM_CODE,CLINIC.TR_P_NUM DESC
    `;
    const result = await runQuery(query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in API endpoint:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (connection) {
      await closeDatabaseConnection(connection);
    }
  }
}
