"use client";

import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function EyadatTahkom() {
  const [rows, setRows] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorType, setErrorType] = useState("info");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const columns = [
    { field: "id", headerName: "م", width: 150 },
    { field: "specName", headerName: "التخصص", width: 250 },
    { field: "clinicName", headerName: "العيادة", width: 250 },
    { field: "count", headerName: "الكشف", width: 130 },
    { field: "extra", headerName: "الاستشارة", width: 130 },
    {
      field: "actions",
      headerName: "الإجراءات",
      width: 130,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            aria-label="add"
            onClick={() => handleAction("+", params.row.id)}
            disabled={!access}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            aria-label="sub"
            onClick={() => handleAction("-", params.row.id)}
            disabled={!access}
          >
            <RemoveIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const fetchDataTable = async () => {
    setLoading(true);
    fetch(`/api/aadadmotaha`)
      .then((response) => {
        response.json().then((res) => {
          setRows(res.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const UpdateCountData = async (cnt,code,type) => {
    setLoading(true);
    setAccess(false)
    fetch(`/api/eyadattahkom?count=${cnt}&code=${code}&type=${type}`)
      .then((response) => {
        response.json().then((res) => {
          handleSnackbarOpen("Updated successfully", "success");
        });
      })
      .catch((err) => {
        console.error(err);
        handleSnackbarOpen("Something happend", "error");
      })
      .finally(() => {
        setLoading(false);
        setAccess(true)
      });
  };

  const fetchUser = async () => {
    setLoading(true);
    fetch(`/api/authentication?user_name=${userName}&pass=${userPassword}`)
      .then((response) => {
        response.json().then((res) => {
          setAccess(res.data);
          if (res.data) {
            handleSnackbarOpen("Login successful!", "success");
          } else {
            handleSnackbarOpen("Login failed!", "error");
          }
        });
      })
      .catch((err) => {
        console.error(err);
        handleSnackbarOpen("Login Error!", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSnackbarOpen = (message, error_type) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setErrorType(error_type);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    // Fetch data when page loads
    fetchDataTable();
  }, []);

  return (
    <>
      <div
        style={{
          padding: 65,
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
        }}
      >
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={errorType}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <div style={{ paddingInline: "15%" }}>
          <div id="pdf-container">
            <h1 style={{ marginBottom: 20, color: "#F0ECE5" }}>
              {" "}
              {`التحكم في العيادات`}
            </h1>
            <br />
            <div>
              <h1 style={{ fontSize: 32 }}>Login Credentials</h1>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ marginBottom: 10, borderRadius: 10 }}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                style={{ marginBottom: 10, borderRadius: 10 }}
              />
              <br />
              <Button
                style={{
                  backgroundColor: "#F0ECE5",
                  color: "#161A30",
                  marginTop: 20,
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={fetchUser}
                variant="contained"
                disabled={
                  loading ||
                  userPassword == null ||
                  userName == null ||
                  userPassword == "" ||
                  userName == ""
                }
              >
                Login
              </Button>
              <br />
              <div
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#F0ECE5",
                    color: "#161A30",
                    marginTop: 20,
                    fontWeight: "bold",
                    width: "45%",
                  }}
                  onClick={fetchDataTable}
                  variant="contained"
                >
                  Refresh
                </Button>
                <br />
                <Button
                  style={{
                    backgroundColor: "#F0ECE5",
                    color: "#161A30",
                    marginTop: 20,
                    fontWeight: "bold",
                    width: "45%",
                  }}
                  onClick={() => UpdateCountData(null, null, 3)}
                  variant="contained"
                  disabled={!access}
                >
                  Reset
                </Button>
              </div>
            </div>
            <br />
            {rows.length <= 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 500,
                }}
              >
                {loading ? <CircularProgress /> : null}
              </div>
            ) : (
              <div
                style={{
                  height: "50%",
                  width: "100%",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <DataGrid
                  rows={rows.map((row, index) => {
                    return {
                      id: index + 1,
                      specName: row[5],
                      clinicName: row[1],
                      count: row[2],
                      extra: row[4],
                    };
                  })}
                  columns={columns.map((col) => ({
                    ...col,
                    align: "center", // Aligns content in the center
                    headerAlign: "center", // Aligns headers in the center
                  }))}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 25 },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  function handleAction(action, index) {
    // Handle the action (either "+" or "-") based on the index
    // You can use the index to identify the specific row in your rows state
    // and update its value accordingly
    const updatedRows = [...rows]; // Create a copy of the rows state array

    const clinic_code = updatedRows[index - 1][3];
  
    let type= action==='+'?1:2

    // Update the count value based on the action
    if (action === "+") {
      updatedRows[index - 1][4] += 1; // Increment count
    } else {
      updatedRows[index - 1][4] -= 1; // Decrement count
    }
      const extra = updatedRows[index - 1][4];
    UpdateCountData(extra,clinic_code,type)
    // Set the state with the updated array
    setRows(updatedRows);
  }
}
