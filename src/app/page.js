import Image from "next/image";
import Button from "@mui/material/Button";
export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{
        backgroundImage: "url('/bg4.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
          فرع النظم <br />
          كوبري القبة
        </h1>
        {/* <Image
          src="/bpm.gif" // Assuming the image is in the "public" directory
          alt="bpm"
          width={480}
          height={270}
          unoptimized={false} // You can omit this line if you don't need to specifically set it to true
          layout="responsive"
        /> */}

        <Button
          style={{
            backgroundColor: "#31304D",
            color: "#F0ECE5",
            marginTop: 100,
          }}
          variant="contained"
          href="/nozomreports"
        >
          تقارير فرع النظم
        </Button>
      </div>
    </main>
  );
}
