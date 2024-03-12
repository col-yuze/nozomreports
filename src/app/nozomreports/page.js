import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import CustomBox from "./CustomBox.js";
import NavBar from "./../../components/NavBar.js";

const items = [
  { title: "نسبة الاشغال", route: "nesbetashghal" }, //done input skeleton
  { title: "احصائية الادوية المنصرفة بالصيدليات خلال فترة", route: "adweya" }, //done input skeleton
  {
    title: "احصائية الادوية المنصرفة بالقسم الداخلي عن يوم",
    route: "adweyadakhly",
  }, //done input skeleton
  { title: "احصائية الادوية المنصرفة بالعيادات عن يوم", route: "adweyaeyadat" }, //done input skeleton
  { title: "احصائية الادوية المنصرفة بقسم الرمد عن يوم", route: "adweyaramad" }, //done input skeleton
  { title: "تقرير المحجوزين بالمجمع خلال فترة", route: "mahgoozfatra" }, //done input skeleton
  { title: "احصائية العيادات", route: "ehsaeyaeyadat" }, //done input skeleton
  { title: "احصائية المرتبات", route: "ehsaeyamoratabatten" }, //done input skeleton
  { title: "احصائية القدوم اليومية", route: "ehsaeyaqodoom" }, //done input skeleton
  { title: "محجوزين", route: "mahgozeen" }, //done input skeleton
  { title: "تقرير مرضي لم يتم تسجيل خروجهم", route: "mardanotout" }, //done input skeleton
  { title: "مرتبات فترة", route: "moratabtfatra" }, //done input skeleton
  { title: "مرتبات", route: "moratbat" }, //done input skeleton
  {
    title: "ادوية منصرفة بالقسم الداخلي عن يوم",
    route: "sarfmoratabatten",
  },
  { title: "تخصصات", route: "takhasosat" }, //done input skeleton
  { title: "تقرير وافدين دخلي", route: "wafedeendakhly" }, //done input skeleton
  { title: "تقرير وافدين عيادات", route: "wafedeeneyadat" }, //done input skeleton
  { title: "احصائية بالاعداد المتاحة في العيادات", route: "aadadmotaha" }, // no need for input skeleton
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
