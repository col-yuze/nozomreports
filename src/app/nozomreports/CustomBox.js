// components/CustomBox.js
import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
const CustomBox = ({ el }) => {
  return (
    <Box key={el} style={{}}>
      <Link href={`/nozomreports/${el.route}`}>
        <button
          class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-2xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          style={{
            display: "flex",
            width: "700", // Adjust the width as needed, considering margins and padding
            marginBottom: "30px", // Optional: Add margin between buttons
          }}
          variant="outlined"
        >
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
            style={{ width: 300 }}
          >
            {el.title}
          </span>
        </button>
      </Link>
    </Box>
  );
};

export default CustomBox;
