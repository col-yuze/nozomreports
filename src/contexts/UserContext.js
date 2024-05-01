// contexts/UserContext.js
"use client"
import React, { createContext, useContext, useState } from "react";

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [groupDetails, setGroupDetails] = useState("");
  const [userDescription, setUserDescription] = useState("");


  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        groupDetails,
        setGroupDetails,
        userDescription,
        setUserDescription,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  return useContext(UserContext);
};
