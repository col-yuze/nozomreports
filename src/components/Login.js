"use client"; // this part for handle click and error for client/server issues
import { Box, InputLabel, TextField } from "@mui/material";
import * as React from "react";
import Icon from "@mui/material/Icon";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Login() {
  const DARK_BLUE = "#153448";
  const [userName, setUserName] = React.useState();
  const [password, setPassword] = React.useState();
  return (
    <Box
      height="70vh" // Set the height to 50% of the viewport height
      width="100vh"
      my={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={2}
      sx={{
        borderRadius: 10,
        position: "relative",
        boxShadow: "1px 2px 3px 1px rgba(0, 0, 0,0.5)",
        overflow: "hidden",
        backgroundImage: "url('/loginbk.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "self-end",
      }}
    >
      <Box width="35%" m={12}>
        <InputLabel
          style={{
            justifyContent: "center",
            alignItems: "center",
            color: DARK_BLUE,
            fontWeight: "bold",
            textTransform: "uppercase",
            paddingBottom: "10%",
          }}
        >
          Login
        </InputLabel>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AccountCircle
              fontSize={"medium"}
              sx={{ marginRight: 1, color: DARK_BLUE }}
            />
            <TextField
              variant="outlined"
              value={userName}
              onChange={(event) => {
                setUserName(event.target.value);
              }}
              style={{
                borderRadius: 20,
              }}
              inputProps={{ style: { backgroundColor: "transparent" } }} // Apply the inputStyles to the input area
            />
          </div>

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            InputProps={{ style: { backgroundColor: "transparent" } }} // Apply the inputStyles to the input area
          />
        </Box>
      </Box>
    </Box>
  );
}
