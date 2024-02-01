import {
  connectToDatabase,
  closeDatabaseConnection,
  runQuery,
} from "../../lib/db";
console.log("connected1");

export default async function handler(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log("connected2");
    // Your logic here, you can use the `runQuery` function
    const result = await runQuery("SELECT * FROM PATIENT");
    res.status(200).json(result);
    console.log("thanks");
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabaseConnection();
  }
}
