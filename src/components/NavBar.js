/* eslint-disable @next/next/no-img-element */
import React from "react";
const NavBar = () => {
  return (
    <>
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
              src="logo.png"
              className="h-8"
              alt="Kobry El Kobba Military Medical Complex Logo"
              style={{ width: 80, height: "auto" }}
            />
            <span
              className="self-center text-2xl  font-semibold  whitespace-nowrap  text-white dark:text-white text"
              style={{ fontFamily: "Lemon" }}
            >
              المجمع الطبي ق.م. بكوبري القبة
            </span>
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {/* <button
              class="bg-white hover:bg-lavender text-lavender  hover:text-white font-bold py-2 px-4 border-b-4 bg-lavender hover:border-lavendertint rounded"
              // onClick={toggle}
            >
              Login
            </button> */}
          </div>
        </div>
      </nav>
      <nav className="bg-zinc-300 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul
              className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm"
              style={{ fontFamily: "Lemon" }}
            >
              <li>
                <a
                  href="/nozomreports"
                  className="text-lavender dark:text-white hover:underline"
                  aria-current="page"
                >
                  تقارير فرع النظم
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  عيادات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  الصيدليات الخارجي
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-lavender dark:text-white hover:underline"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default NavBar;
