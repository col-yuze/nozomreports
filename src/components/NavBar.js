/* eslint-disable @next/next/no-img-element */
"use client";
import { useUser } from "@/contexts/UserContext";
import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { name, userDescription, groupDetails,setGroupDetails } = useUser();
  const router = useRouter()

  const handleLogout = () => {
    // Implement your logout logic here
    setGroupDetails(null)
    router.push('/')
 };
  return groupDetails ? (
    <div>
      <nav
        className="bg-lavender border-gray-200 light:b-white"
        margintop="0px"
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 h-20">
          <a
            className="flex items-center space-x-3 rtl:space-x-reverse h-14"
            padding="0px"
            href="/"
          >
            <img
              src="/logo.png"
              className="h-8"
              alt="Kobry El Kobba Military Medical Complex Logo"
              style={{ width: 80, height: "auto" }}
            />
            <span
              className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white text"
              style={{ fontFamily: "Lemon" }}
            >
              المجمع الطبي ق.م. بكوبري القبة
            </span>
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse"></div>
        </div>
      </nav>
      <nav className="bg-zinc-300 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div
            className="flex items-center"
            style={{ justifyContent: "space-between" }}
          >
            <ul
              className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm"
              style={{ fontFamily: "Lemon" }}
            >
              <li>
                <Link href="/nozomreports">تقارير فرع النظم</Link>
              </li>
              <li>
                <Link href="/eyadat">عيادات</Link>
              </li>
            </ul>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <Typography
                variant="body1"
                style={{ fontSize: 12, paddingRight: 10 }}
              >
                {groupDetails.name}
              </Typography>
              <Typography
                variant="body1"
                style={{ fontSize: 20, fontWeight: "bold" }}
              >
                {name}
              </Typography>
              <IconButton onClick={handleLogout} color="inherit">
                <ExitToAppIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </nav>
    </div>
  ) : null;
};

export default NavBar;
