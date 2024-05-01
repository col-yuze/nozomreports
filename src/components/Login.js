"use client"; // this part for handle click and error for client/server issues
import React, { useContext } from "react";
import {
  Box,
  InputLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Image from "next/image";
import Button from "@mui/material/Button";
import Cookies from "js-cookie"; // Import js-cookie library
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation.js";

export default function Login() {
  const DARK_BLUE = "#153448bb";
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  // const [rememberMe, setRememberMe] = React.useState(false);
  const [disableBtn, setDisableBtn] = React.useState(false);
  const { setName, setUserDescription, setGroupDetails } = useUser();
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // const handleRememberMeChange = () => {
  //   setRememberMe(!rememberMe);
  // };

  // const removeCookies = () => {
  //   Cookies.remove("username");
  //   Cookies.remove("password");
  // };
  
  const signIn = async () => {
    console.log("sign in");
    setDisableBtn(true);
    fetch(`/api/login?username=${userName}&pass=${password}`)
      .then((response) => {
        response.json().then((res) => {
          console.log(res.data);

          if (res.data) {
            setName(res.data[0]);
            setUserDescription(res.data[1]);
            setGroupDetails({ name: res.data[2], code: res.data[3] });
            router.push("/nozomreports")
          } else {
            // Display error message in Snackbar
            setSnackbarMessage("Wrong user name or password");
            setSnackbarOpen(true);
            // Hide Snackbar after 3000ms
            setTimeout(() => {
              setSnackbarOpen(false);
            }, 3000);
          }
          // If remember me is activated, save the data in a cookie
          // if (rememberMe) {
          //   Cookies.set("username", userName);
          //   Cookies.set("password", password);
          // } else {
          //   // If remember me is not checked, unset the cookie
          //   removeCookies();
          // }
        });
      })
      .catch((err) => {
        console.error(err);
        // Display error message in Snackbar
        setSnackbarMessage("Error: Use client");
        setSnackbarOpen(true);
        // Hide Snackbar after 3000ms
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);
      })
      .finally(() => {
        setDisableBtn(false);
      });
  };

  // // Function to retrieve cookie data and set state
  // const getCookies = async () => {
  //   setUserName(Cookies.get("username")??userName);
  //   setPassword(Cookies.get("password")??password);
  // };

  return (
    <Box
      height="70vh"
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{vertical:'top',horizontal:'center'}}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
            <Image src={"/logo.png"} width="45" height="50" alt="" />
            <span style={{ textAlign: "end", fontSize: 26 }}>
              nozom reports
            </span>
          </InputLabel>
          <form>
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
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow for depth
                  transition: "background-color 0.3s", // Smooth transition for hover effect
                }}
                onClick={signIn}
                disabled={disableBtn}
              >
                Sign In
              </Button>

              {/* <div
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
            </div> */}
            </Box>
          </form>
        </div>
        <footer
          style={{
            color: DARK_BLUE,
            paddingTop: "25%",
            fontSize: 12,
          }}
        >
          Powered by Nozom Labs
        </footer>
      </Box>
    </Box>
  );
}
