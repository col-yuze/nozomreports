import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import CustomBox from "./CustomBox.js";
import NavBar from "./../../components/NavBar.js";

const items = [
  { title: "نسبة الاشغال", route: "nesbetashghal" },
  { title: "adweya", route: "adweya" },
  { title: "ادوية دخلي", route: "adweyadakhly" },
  { title: "ادوية عيادات", route: "adweyaeyadat" },
  { title: "ادوية رمد", route: "adweyaramad" },
  { title: "4", route: "4" },
  { title: "5", route: "5" },
  { title: "تقرير المحجوزين بالمجمع خلال فترة", route: "mahgoozfatra" },
  { title: "احصائية العيادات", route: "ehsaeyaeyadat" },
  { title: "احصائية المرتبات", route: "ehsaeyamoratabatten" },
  { title: "احصائية القدوم", route: "ehsaeyaqodoom" },
  { title: "محجوزين", route: "mahgozeen" },
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
      <NavBar></NavBar>
      <h1 style={{ position: "relative", top: 50 }}>تقارير فرع النظمـ</h1>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        style={{
          position: "relative",
          top: 60,
          width: "100%",
          maxWidth: "2000px",
          margin: "10 auto",
        }}
      >
        {items.map((el) => (
          <CustomBox key={el.title} el={el} />
        ))}
      </Box>
    </div>
  );
}
