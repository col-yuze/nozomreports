///api/hello.js

export default function handler(req, res) {
  // Handling different HTTP methods
  if (req.method === "GET") {
    // Handling GET request
    res.status(200).json({ message: "Hello, Next.js!" });
  } else {
    // Handling other HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
