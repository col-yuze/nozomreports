import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import CustomBox from "./CustomBox.js";

const items = [
  { title: "نسبة الاشغال", route: "nesbetashghal" },
  { title: "رمد", route: "ramad" },
  { title: "1", route: "1" },
  { title: "2", route: "2" },
  { title: "3", route: "3" },
  { title: "4", route: "4" },
  { title: "5", route: "5" },
  { title: "تقرير المحجوزين بالمجمع خلال فترة", route: "6" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
  { title: "test", route: "test" },
];

const elements = ["Page1", "Page2"];
export default function nozomreports() {
  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100%",
      }}
    >
      <h1 style={{ position: "relative", top: 25 }}>تقارير فرع النظم</h1>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        style={{
          position: "relative",
          top: 25,
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {items.map((el) => (
          <CustomBox key={el.title} el={el} />
        ))}
      </Box>
    </div>
  );
}
