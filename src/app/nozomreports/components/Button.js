import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return <Button onClick={handleClick}>Save as PDF</Button>;
};

export default CustomButton;
