import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const items = ["نسبة الاشغال", "رمد", "1", "2", "3", "4", "5", "6"];

export default function nozomreports() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="flex-end"
    >
      {items.map((el) => (
        <Box key={el} style={{}}>
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
            {el}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
