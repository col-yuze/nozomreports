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
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const columns = [
    { field: "id", headerName: "م", width: 150 },
    { field: "clinicName", headerName: "العيادة", width: 500 },
    { field: "count", headerName: "العدد", width: 130 },
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
          console.log(res.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUser = async () => {
    setLoading(true);
    fetch(`/api/authentication?user_name=${userName}&pass=${userPassword}`)
      .then((response) => {
        response.json().then((res) => {
          setAccess(res.data);
          if (res.data) {
            handleSnackbarOpen("Login successful!");
          } else {
            handleSnackbarOpen("Login failed!");
          }
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const AccessChange = () => {
    // Handle access change here
  };
  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
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
            severity={access ? "success" : "error"}
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
                  userPassword == '' ||
                  userName == ''
                }
              >
                Login
              </Button>
              <br />
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
                    return { id: index + 1, clinicName: row[1], count: row[2] };
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
  }
}
