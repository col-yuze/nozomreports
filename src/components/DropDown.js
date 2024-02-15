import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const options = [
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

const DropDown = ({ selectedOption, setSelectedOption }) => {
  const onSelect = (selectedOption) => {
    setSelectedOption(selectedOption.value);
  };

  return (
    <Dropdown options={options} onChange={onSelect} value={selectedOption} />
  );
};

export default DropDown;
