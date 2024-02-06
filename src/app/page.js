import Image from "next/image";
import Button from "@mui/material/Button";
import NavBar from "../components/NavBar";
// import { useState } from "react";
// const [showMe, setShowMe] = useState(false);
// function toggle() {
//   setShowMe(!showMe);
// }
export default function Home() {
  return (
    <>
      <NavBar></NavBar>
      <main
        className="flex min-h-screen flex-col items-center justify-between p-24"
        style={{
          backgroundImage: "url('/bg4.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            color: "#F0ECE5", // Set text color to contrast with the background
          }}
        >
          <h1 style={{ fontSize: 92, style: "bold" }}>
            فرع نــظم المعلومــات <br />
            كوبري القبة
          </h1>
          {/* <Image
          src="/bpm.gif" // Assuming the image is in the "public" directory
          alt="bpm"
          width={480}
          height={270}
          unoptimized={false} // You can omit this line if you don't need to specifically set it to true
          layout="responsive"
        /> */}

          {/* <Button
            style={{
              backgroundColor: "#31304D",
              color: "#F0ECE5",
              marginTop: 100,
            }}
            variant="contained"
            href="/nozomreports"
          >
            تقارير فرع النظم
          </Button> */}

          {/* <div style={{ height: "500px", display: showMe ? "block" : "none" }}>
            <div class="fixed pin flex items-center">
              <div class="fixed pin bg-black opacity-75 z-10"></div>

              <div class="relative mx-6 md:mx-auto w-full md:w-1/2 lg:w-1/3 z-20 m-8">
                <div class="shadow-lg bg-white rounded-lg p-8">
                  <div class="flex justify-end mb-6">
                    <button>
                      <span class="mr-2">Close</span>
                      <span>
                        <i class="fa fa-times"></i>
                      </span>
                    </button>
                  </div>

                  <h1 class="text-center text-2xl text-green-dark">Login</h1>

                  <form class="pt-6 pb-2 my-2">
                    <div class="mb-4">
                      <label class="block text-sm font-bold mb-2" for="email">
                        Email Address
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                        id="email"
                        type="text"
                        placeholder="Email Address"
                      />
                    </div>
                    <div class="mb-6">
                      <label
                        class="block text-sm font-bold mb-2"
                        for="password"
                      >
                        Password
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                        id="password"
                        type="password"
                        placeholder="Password"
                      />
                    </div>
                    <div class="block md:flex items-center justify-between">
                      <div>
                        <button
                          class="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded border-b-4 border-green-darkest"
                          type="button"
                        >
                          Sign In
                        </button>
                      </div>

                      <div class="mt-4 md:mt-0">
                        <a href="#" class="text-green no-underline">
                          Forget Password?
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </main>
    </>
  );
}
