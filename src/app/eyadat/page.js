import * as React from "react";
import Box from "@mui/material/Box";
import CustomBox from "../../components/CustomBox.js";
import NavBar from "../../components/NavBar.js";

const items = [
  { title: "كشوفات العيادات", route: "koshofateyadat" }, //done input skeleton
  { title: "نسبة الاشغال", route: "nesbetashghal" }, //done input skeleton
  { title: "العيادات", route: "adweyaeyadat" }, //done input skeleton
  { title: "الرمد", route: "adweyaramad" }, //done input skeleton
  { title: " احصائية العيادات اليومية", route: "ehsaeyaeyadat" }, //done input skeleton
  { title: "تخصصات", route: "takhasosat" }, //done input skeleton
  { title: "تقرير الوافدين (عيادات)", route: "wafedeeneyadat" }, //done input skeleton
  { title: "احصائية بالاعداد المتاحة في العيادات", route: "aadadmotaha" }, // no need for input skeleton
  { title: "احصائية العياادات تخصصات", route: "takhasosateyadat" }, //done input skeleton
];

export default function eyadat() {
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
      <h1 style={{ position: "relative", top: 50 }}>تقارير العيادات</h1>
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
          <CustomBox key={el.title} el={el} routePage={'eyadat'}/>
        ))}
      </Box>
    </div>
  );
}
