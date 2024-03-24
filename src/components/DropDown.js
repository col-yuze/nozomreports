import { minifyRaw } from "babel-plugin-styled-components/lib/minify";
import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import Tooltip from "@mui/material/Tooltip";

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

var tooltip = "اختــر المــستشــفى اولا";
const DropDown = ({
  selectedOption,
  setSelectedOption,
  mode,
  placeholderText,
  disabled,
  dynamicOptions,
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
    : mode === "10"
    ? (options = ["3-عادى", "8-صدر"])
    : mode === "7" || mode === "4"
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
    : mode === "ghorfa"
    ? (options = dynamicOptions)
    : mode === "hosps"
    ? (options = dynamicOptions)
    : mode === "aqsamSpecific"
    ? (options = dynamicOptions)
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
  tooltip =
    mode === "ghorfa" ? "اختــر الـقـسـم اولا" : "اختــر المــستشــفى اولا";

  const handleClick = () => {
    if (disabled) {
      ReactTooltip.show("dropdown-tooltip");
    } else {
      // Handle click event
    }
  };

  const handleHover = () => {
    if (disabled) {
      ReactTooltip.show("dropdown-tooltip");
    } else {
      // Handle hover event
    }
  };
  return (
    <>
      {/* {selectedOption ? (
        <Tooltip title={tooltip}>
          <div className="fixed-width-dropdown">
            <Dropdown
              options={options}
              onChange={onSelect}
              value={selectedOption}
              placeholder={placeholderText}
              style={{ width: "200px" }}
              disabled={disabled}
              onClick={handleClick}
              onMouseEnter={handleHover}
              onMouseLeave={() => ReactTooltip.hide()}
            />
          </div>
        </Tooltip>
      ) : ( */}
      <div className="fixed-width-dropdown">
        <Dropdown
          options={options}
          onChange={setSelectedOption}
          value={selectedOption}
          placeholder={placeholderText}
          style={{ width: "200px" }}
          disabled={disabled}
          onClick={handleClick}
          onMouseEnter={handleHover}
          onMouseLeave={() => ReactTooltip.hide()}
        />
      </div>
      {/* )} */}
    </>
  );
};

export default DropDown;
