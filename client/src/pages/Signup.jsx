import { React, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { setSignup, resetSignupData } from "../redux/Slices/authSlice";
import SignupForm from "../components/SignupForm";
import { useDispatch, useSelector } from "react-redux";
function Signup() {
  const navigate = useNavigate();
  const { signup } = useSelector((state) => state.auth);
  const [type, setType] = useState("Student");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="flex bg-[#f9fafa]">
      <div className=" w-full flex flex-col items-center justify-center">
        <div className=" md:w-[60%] w-full  ">
          <div>
            <div
              onClick={() => {
                navigate("/");
                dispatch(setSignup(false));
                dispatch(resetSignupData(null));
              }}
              className="flex hover:cursor-pointer font-semibold text-blue-400 items-center gap-1"
            >
              <IoIosArrowBack />
              Back to Login
            </div>
            <h1 className="font-bold text-4xl ml-2">Signup</h1>
          </div>
          {!signup && (
            <SignupForm
              type={type}
              setType={setType}
              setIsLoading={setIsLoading}
            />
          )}

          {isLoading && <div className="loading-spinner">Loading...</div>}
        </div>
      </div>
    </div>
  );
}

export default Signup;
