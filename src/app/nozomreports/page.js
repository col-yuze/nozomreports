"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import CustomBox from "../../components/CustomBox.js";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const items = [
  { title: "نسبة الاشغال", route: "nesbetashghal" }, //done input skeleton
  { title: " احصائية العيادات اليومية", route: "ehsaeyaeyadat" }, //done input skeleton
  { title: "احصائية القدوم اليومية", route: "ehsaeyaqodoom" }, //done input skeleton
  { title: "احصائية العياادات تخصصات", route: "takhasosateyadat" }, //done input skeleton
  { title: "العيادات", route: "adweyaeyadat" }, //done input skeleton
  { title: "الرمد (عيادات)", route: "adweyaramad" }, //done input skeleton
  { title: "احصائية المرتبات العلاجية", route: "moratbat" }, //done input skeleton
  { title: "تقرير وافدين (دخلي)", route: "wafedeendakhly" }, //done input skeleton
  { title: "تقرير الوافدين (عيادات)", route: "wafedeeneyadat" }, //done input skeleton
  { title: "احصائيةالمرتبات لاكثر من 10 ادوية", route: "ehsaeyamoratabatten" }, //done input skeleton
  {
    title: "تقرير صرف مرتبات اكثر من 10 ادوية",
    route: "sarfmoratabatten",
  },
  { title: "تقرير مرضي لم يتم تسجيل خروجهم", route: "mardanotout" }, //done input skeleton
  { title: "تقرير المحجوزين بالمجمع خلال فترة", route: "mahgoozfatra" }, //done input skeleton
  { title: "تقرير بالمحجوزين حاليا بالمجمع", route: "mahgozeen" }, //done input skeleton
  { title: "احصائية الادوية المنصرفة بالصيدليات خلال فترة", route: "adweya" }, //done input skeleton
  { title: "احصائية الادوية المنصرفة مرتبات علاجية", route: "adweyamoratabat" }, // no need for input skeleton
  {
    title: "احصائية الادوية المنصرفة مرتبات علاجية_تخصصات",
    route: "takhasosat",
  }, //done input skeleton
  { title: "تقرير الادوية المنصرفة لصالح قسم دخلي", route: "taqreeradweya" }, //done input skeleton
  {
    title: "احصائية الادوية المنصرفة بالقسم الداخلي عن يوم",
    route: "adweyadakhly",
  }, //done input skeleton
  { title: "مرتبات علاجية منصرفة لمريض خلال فترة", route: "moratabtfatra" }, //done input skeleton
  { title: "احصائية بالاعداد المتاحة في العيادات", route: "aadadmotaha" }, // no need for input skeleton
];

export default function NozomReports() {
  const router = useRouter();
  const finalItemsList = {
    admin: items,
    patient_affairs: [items[0], items[12], items[13]],
  };
  const [finalItems, setFinalItems] = React.useState([]);
  let groupCode = Cookies.get("group_code");
  React.useEffect(() => {
    console.log(groupCode);
    if (Cookies.get("group_code")) {
      console.log("there is", Cookies.get("group_code"));
    }
    // Redirect if groupDetails is false
    if (!groupCode) {
      router.push("/"); // Redirect to login page
    } else {
      if (groupCode === "1001" || groupCode === "1005") {
        // مدير النظام او جنود فرع النظم
        setFinalItems(finalItemsList.admin);
      } else if (groupCode === "1011") {
        // شئون المرضي
        setFinalItems(finalItemsList.patient_affairs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupCode, router]);
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
        {groupCode
          ? finalItems.map((el) => (
              <CustomBox key={el.title} el={el} routePage={"nozomreports"} />
            ))
          : null}
      </Box>
    </div>
  );
}
