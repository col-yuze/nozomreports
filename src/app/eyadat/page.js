"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import CustomBox from "../../components/CustomBox.js";
import { useRouter } from "next/navigation.js";
import { useUser } from "@/contexts/UserContext.js";
const items = [
  { title: "كشوفات العيادات", route: "koshofateyadat", parentRoute: "eyadat" }, //done input skeleton
  { title: "التحكم في العيادات", route: "eyadattahkom", parentRoute: "eyadat" }, //done input skeleton
  {
    title: "نسبة الاشغال",
    route: "nesbetashghal",
    parentRoute: "nozomreports",
  }, //done input skeleton
  { title: "العيادات", route: "adweyaeyadat", parentRoute: "nozomreports" }, //done input skeleton
  { title: "الرمد", route: "adweyaramad", parentRoute: "nozomreports" }, //done input skeleton
  {
    title: " احصائية العيادات اليومية",
    route: "ehsaeyaeyadat",
    parentRoute: "nozomreports",
  }, //done input skeleton
  { title: "تخصصات", route: "takhasosat", parentRoute: "nozomreports" }, //done input skeleton
  {
    title: "تقرير الوافدين (عيادات)",
    route: "wafedeeneyadat",
    parentRoute: "nozomreports",
  }, //done input skeleton
  {
    title: "احصائية بالاعداد المتاحة في العيادات",
    route: "aadadmotaha",
    parentRoute: "nozomreports",
  }, // no need for input skeleton
  {
    title: "احصائية العياادات تخصصات",
    route: "takhasosateyadat",
    parentRoute: "nozomreports",
  }, //done input skeleton
];

export default function Eyadat() {
  const router = useRouter();
  const { groupDetails } = useUser();

  React.useEffect(() => {
    console.log(groupDetails);
    // Redirect if groupDetails is false
    if (!groupDetails) {
      router.push("/"); // Redirect to login page
    }
  }, [groupDetails, router]);
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
        {groupDetails
          ? items.map((el) => (
              <CustomBox key={el.title} el={el} routePage={el.parentRoute} />
            ))
          : null}
      </Box>
    </div>
  );
}
