import {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} from "../../lib/db";

export default async function handler(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();

    // Your logic here, you can use the `runQuery` function
    const result = await runQuery("SELECT * FROM PATIENT");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabaseConnection();
  }
}
