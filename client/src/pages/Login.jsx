import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserLogin, WalletLogin } from "../services/operations/authApi";
import { setToken, setUser, setType } from "../redux/Slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  // MetaMask Login Handler
  const handleWalletLogin = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Generate a timestamp for the message
      const timestamp = Date.now();
      const message = `Sign this message to verify login: ${timestamp}`;

      const signature = await signer.signMessage(message);

      const result = await WalletLogin({ address, signature, timestamp });

      if (result?.token && result?.user) {
        localStorage.setItem("lmstoken", JSON.stringify(result.token));
        localStorage.setItem("lmsuser", JSON.stringify(result.user));
        localStorage.setItem("lmsuser", JSON.stringify("guest"));
        dispatch(setToken(result.token));
        dispatch(setUser(result.user));
        dispatch(setType("guest"));

        navigate("/dashboard/my-dashboard");
      } else {
        setAuthError("Wallet authentication failed.");
      }
    } catch (err) {
      console.error("Wallet login error:", err);
      setAuthError("Failed to login with wallet. Try again.");
    }
  };

  async function onSubmit(data) {
    try {
      const result = await UserLogin(data);
      console.log(result);
      if (result?.token && result?.user) {
        localStorage.setItem("lmstoken", JSON.stringify(result.token));
        localStorage.setItem("lmsuser", JSON.stringify(result.user));
        localStorage.setItem("type", JSON.stringify(result.type));

        dispatch(setToken(result.token));
        dispatch(setUser(result.user));
        dispatch(setType(result.type));

        navigate("/dashboard");
      } else {
        setAuthError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Login failed. Please try again.");
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center bg-[#f9fafa]">
        <div className="lg:w-[500px] w-[400px]">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">LOGIN</h1>
            <p className="text-gray-600">Hello, welcome back!</p>
          </div>
          <div className="p-5 mt-10 bg-white shadow rounded-2xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-6"
            >
              <div>
                <label htmlFor="userName" className="lable-class">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="input-class"
                  {...register("userName", {
                    required: "Username is required",
                  })}
                />
                {errors.userName && (
                  <span className="error-style">{errors.userName.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="password" className="lable-class">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    name="password"
                    id="password"
                    className="input-class"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 4,
                        message: "Password must be at least 4 characters",
                      },
                    })}
                  />
                  {showPassword ? (
                    <LuEyeOff
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <LuEye
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.password && (
                  <span className="error-style">{errors.password.message}</span>
                )}
              </div>

              {authError && <p className="text-red-500">{authError}</p>}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white bg-[#22a7f1]"
                >
                  Login with Username & Password
                </button>
                <button
                  type="button"
                  onClick={handleWalletLogin}
                  className="px-6 py-3 rounded-xl text-white bg-[#f7931a]"
                >
                  {walletAddress
                    ? `Wallet Connected: ${walletAddress}`
                    : "Login with MetaMask"}
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold text-[14px] text-gray-500">
                  Don't have an account?
                </p>
                <Link
                  to={"/signup"}
                  className="underline text-sm text-[#22a7f1] font-bold"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
