import { minifyRaw } from "babel-plugin-styled-components/lib/minify";
import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

var options = [
  "0-الكل",
  "1-مستشفى الجراحة",
  "2-مستشفى الباطنة",
  "3-مستشفى الجهاز التنفسي",
  "4-مستشفى الاسنان التخصصي",
  "5-الاستقبال و الطوارئ و الحوادث",
  "6-مستشفى الكلى",
  "7-مستشفى القلب التخصصي",
  "8-مستشفى العيون التخصصي",
  "9-السموم",
];

const defaultOption = "اختـــــــر";

const DropDown = ({
  selectedOption,
  setSelectedOption,
  mode,
  placeholderText,
}) => {
  const [opts, setOpts] = React.useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/aqsamdakhly")
        .then((response) => {
          response.json().then((res) => {
            setOpts(res.data);
          });
        })
        .catch((err) => console.error(err));
    };

    console.log(mode);
    if (mode == 8 || mode == "aqsam") {

      fetchData();
    }
  }, []);

  const onSelect = (selectedOption) => {
    setSelectedOption(selectedOption.value);
  };
  mode === "2"
    ? (options = ["asdasd", "dasd"])
    : mode === "3"
    ? (options = ["مرتبات", "اكتر ", "من", "10"])
    : mode === "5"
    ? (options = [
        "القسم الداخلي",
        "غرفة 308 ",
        " غرفة ج 90912",
        "عمليات السادس",
      ])
    : mode === "6"
    ? (options = [
        "مشير",
        "فريق اول ",
        "فريق",
        "لواء",
        "عميد",
        "عقيد",
        "مقدم",
        "رائد",
        "نقيب",
        "ملازم اول",
        "ملازم",
        "مساعد اول",
        "مساعد",
        "رقيب اول",
        "رقيب",
        "عريف",
        "جندي",
        "مدني",
      ])
    : mode === "4"
    ? (options = [
        "0-الكل",
        "1-مستشفى الجراحة",
        "2-مستشفى الباطنة",
        "3-مستشفى الجهاز التنفسي",
        "4-مستشفى الاسنان التخصصي",
        "5-الاستقبال و الطوارئ و الحوادث",
        "6-مستشفى الكلى",
        "7-مستشفى القلب التخصصي",
        "8-مستشفى العيون التخصصي",
        "9-السموم",
      ])
    : mode === "7"
    ? (options = [
        "0-الكل",
        "1-مستشفى الجراحة",
        "2-مستشفى الباطنة",
        "3-مستشفى الجهاز التنفسي",
        "4-مستشفى الاسنان التخصصي",
        "5-الاستقبال و الطوارئ و الحوادث",
        "6-مستشفى الكلى",
        "7-مستشفى القلب التخصصي",
        "8-مستشفى العيون التخصصي",
        "9-السموم",
      ])
    : mode === "8" || mode === "aqsam"
    ? (options = opts.map((el) => `${el[0]}-${el[1]}`))
    : (options = [
        "0-الكل",
        "1-مستشفى الجراحة",
        "2-مستشفى الباطنة",
        "3-مستشفى الجهاز التنفسي",
        "4-مستشفى الاسنان التخصصي",
        "5-الاستقبال و الطوارئ و الحوادث",
        "6-مستشفى الكلى",
        "7-مستشفى القلب التخصصي",
        "8-مستشفى العيون التخصصي",
        "9-السموم",
      ]);
  return (
    <div className="fixed-width-dropdown">
      <Dropdown
        options={options}
        onChange={onSelect}
        value={selectedOption}
        placeholder={placeholderText}
        style={{ width: "200px" }}
      />
    </div>
  );
};

export default DropDown;
