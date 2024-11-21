import { useState } from "react";
import "./App.css";

import StakeHeading from "./component/stakeHeading";
import Stake from "./component/Stake";
import Withdrawal from "./component/Withdrawal";
import RewardSection from "./component/Rewardsection";

function App() {
  const [toggle, setToggle] = useState(true);
  return (
    <div className="">
      <div className="w-full">
        {/* <div className="h-screen bg-gradient-to-r from-[rgb(73,37,89)] via-custom-mid-dark-purple to-[rgb(73,37,89)] w-full h-64   "> */}
        <div className="bg-gradient-to-r  from-[#0d0221] via-[#1a0531] to-[#3d2172] w-full ">
          <div className="    border border-custom-dark-purple ">
            <div className="flex m-auto   justify-center mt-20 gap-40">
              <StakeHeading />
              {/* form */}
              <div className="p-2   ">
                <nav className="border shadow-lg  flex flex-col    bg-custom-dark-purple gap-8 rounded">
                  <div className="flex  justify-around  rounded  bg-custom-dark-purple p-6">
                    <div
                      className={
                        toggle
                          ? "bg-custom-mid-dark-purple hover:bg-[#6F2F9F] transition-all duration-300 ease-in-out transform hover:scale-105  rounded border  px-8 cursor-pointer "
                          : " bg-custom-light-purple hover:bg-custom-mid-dark-purple  transition-all duration-300 ease-in-out transform hover:scale-105 rounded border  px-8 cursor-pointer "
                      }
                      onClick={() => setToggle(true)}
                    >
                      Stake
                    </div>
                    <div
                      className={
                        toggle
                          ? " bg-custom-light-purple   hover:bg-custom-mid-dark-purple  transition-all duration-300 ease-in-out transform hover:scale-105 rounded border  px-5 cursor-pointer "
                          : "bg-custom-mid-dark-purple   hover:bg-[#6F2F9F] transition-all duration-300 ease-in-out transform hover:scale-105  rounded border  px-8 cursor-pointer  "
                      }
                      onClick={() => setToggle(false)}
                    >
                      Withdrawal
                    </div>
                  </div>
                  <div className="p-2 w-[30vw] bg-custom-dark-purple">
                    {toggle ? <Stake /> : <Withdrawal />}
                    {/* <Stake /> */}
                  </div>
                </nav>
                <div className="mt-10 rounded-xl    bg-custom-dark-purple">
                  <RewardSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
