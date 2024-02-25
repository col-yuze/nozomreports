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
    : "";
  return (
    <Dropdown
      options={options}
      onChange={onSelect}
      value={selectedOption}
      placeholder={placeholderText}
    />
  );
};

export default DropDown;
