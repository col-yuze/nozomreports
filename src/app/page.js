'use client'
import Login from "@/components/Login";
export default function Home() {
 
  return (
    <>
        <main
        className="flex min-h-screen flex-col items-center justify-between p-24"
          style={{
            backgroundImage: "url('/bg4.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            paddingTop:10
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            color: "#F0ECE5", // Set text color to contrast with the background
            }}
          >
            <h1 style={{ fontSize: 92, style: "bold" }}>
              فرع نــظم المعلومــات <br />
              كوبري القبة
            </h1>
            { <Login /> }
          </div>
        </main>
    </>
  );
}
