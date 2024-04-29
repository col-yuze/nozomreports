"use client"; // this part for handle click and error for client/server issues
import {
  Box,
  InputLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import * as React from "react";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Image from "next/image";
import { Button } from "@mui/base";

export default function Login() {
  const DARK_BLUE = "#153448bb";
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);
    const [disbaleBtn, setDisableBtn] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
    };
    const signIn = () => {
        console.log('sign in')
        setDisableBtn(true)
    }
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
      <Box
        width="40%"
        sx={{
          backgroundColor: "white",
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-around",
          borderRadius: 5,
          height: "80%",
          marginTop: "8%",
          marginRight: "7%",
          boxShadow: "1px 2px 3px 1px rgba(0, 0, 0,0.5)",
        }}
      >
        <div>
          <InputLabel
            style={{
              justifyContent: "center",
              alignItems: "center",
              color: DARK_BLUE,
              fontWeight: "bold",
              textTransform: "uppercase",
              flexDirection: "row",
              display: "flex",
              height: "40%",
              width: "100%",
              marginBottom: "15%",
            }}
          >
            <Image src={"/logo.png"} width="45" height="50" />
            <span style={{ textAlign: "end", fontSize: 26 }}>
              nozom reports
            </span>
          </InputLabel>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
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
                variant="standard"
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value);
                }}
                inputProps={{
                  style: { backgroundColor: "lightblue", borderRadius: 20 },
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "11%",
              }}
            >
              <Lock
                fontSize={"medium"}
                sx={{ marginRight: 1, color: DARK_BLUE }}
              />
              <TextField
                variant="standard"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                inputProps={{
                  style: { backgroundColor: "lightblue", borderRadius: 20 },
                }}
              />
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#ADD8E6",
                width: "40%",
                height: "15%",
                borderRadius: 20,
                fontSize: 18,
                color: DARK_BLUE,
                borderColor: "black",
                fontWeight: "bold",
                          }}
                          onClick={signIn}
            >
              Sign In
            </Button>
            <div
              style={{ width: "100%", marginRight: "25%", color: DARK_BLUE }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    sx={{
                      color: DARK_BLUE, // Set the color of the checkbox
                      "&.Mui-checked": {
                        color: DARK_BLUE, // Set the color when checkbox is checked
                      },
                    }}
                  />
                }
                label="Remember Me"
              />
            </div>
          </Box>
        </div>
        <footer
          style={{
            color: DARK_BLUE,
            paddingTop: 20,
          }}
        >
          Powered by Nozom Labs
        </footer>
      </Box>
    </Box>
  );
}
