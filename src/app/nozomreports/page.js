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
  { title: "6", route: "6" },
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
        paddingInline: "5%",
      }}
    >
      <h1 margintop="1000">تقارير فرع النظم</h1>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        {items.map((el) => (
          <CustomBox key={el.title} el={el} />
        ))}
      </Box>
    </div>
  );
}
