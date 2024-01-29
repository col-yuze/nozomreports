// components/CustomBox.js
import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
const CustomBox = ({ el }) => {
  return (
    <Box key={el} style={{}}>
      <Link href={`/nozomreports/${el.route}`}>
        <Button
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: "#454545",
            height: 300,
            width: 500,
            margin: 10,
            borderRadius: 10,
            color: "white",
          }}
          variant="outlined"
        >
          {el.title}
        </Button>
      </Link>
    </Box>
  );
};

export default CustomBox;
