import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSignupData,
  setSignup,
  setToken,
  setUser,
} from "../../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ name }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handlelogout() {
    localStorage.removeItem("lmstoken");
    localStorage.removeItem("lmsuser");
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetSignupData(null));
    dispatch(setSignup(false));
    navigate("/");
  }

  return (
    <div className="flex justify-between  bg-gray-100 mb-8">
      <div className="md:text-2xl text-xl lg:text-3xl font-bold pl-10 text-black">
        {name}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group relative">
          <div className="capitalize font-semibold flex cursor-pointer">
            Hi, {user?.firstName}
            <RiArrowDropDownLine size={25} />
          </div>
          <div
            className="invisible absolute left-[50%]
                      translate-x-[-55%] translate-y-[45%]
                   top-[50%]
                  flex flex-col rounded-lg bg-black text-white p-4 text-richblack-5
                  opacity-0 transition-all duration-200 group-hover:visible
                  group-hover:opacity-100 lg:w-[150px] w-[180px] z-20"
          >
            <div
              className="absolute left-[30%] top-0
                  translate-x-[80%]
                  translate-y-[-15%] h-6 w-6 rotate-45 rounded bg-black z-20"
            ></div>
            <button
              onClick={handlelogout}
              className="text-sm font-semibold hover:text-blue-300 transition-all duration-200 ease-out"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
