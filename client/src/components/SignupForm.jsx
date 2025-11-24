import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  resetSignupData,
  setSignupData,
  setSignup,
  setUser,
} from "../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { UserSignup } from "../services/operations/authApi";

function SignupForm({ type, setType }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState([
    { account_name: "", privateKey: "" },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(value)) return "Password must include at least one number";
    if (!/[a-z]/.test(value))
      return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(value))
      return "Password must include at least one uppercase letter";
    if (!/[!@#$%^&*]/.test(value))
      return "Password must include at least one special character";
    return true;
  };

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, { account_name: "", privateKey: "" }]);
  };

  const handleRemoveAccount = (index) => {
    const updatedAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(updatedAccounts);
  };

  async function onSubmit(data) {
    try {
      const formData = { ...data, accounts };
      const result = await UserSignup(formData);
      console.log(result);
      if (result) {
        dispatch(setUser(result));
        localStorage.setItem("lmsuser", JSON.stringify(result));
        dispatch(resetSignupData(null));

        dispatch(setSignupData(data));
        dispatch(setSignup(true));
        navigate("/dashboard");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup", error);
    }
  }

  return (
    <div className="p-5 mt-10 w-full bg-white shadow-md rounded-2xl">
      <div className="bg-[#f1f3f4] py-1 px-1.5 rounded-md">
        <button
          onClick={() => setType("Student")}
          className={`w-1/2 ${
            type === "Student"
              ? "text-black bg-white"
              : "bg-transparent text-gray-500"
          } transition-all duration-200 text-sm ease-in-out rounded-sm font-semibold`}
        >
          Student
        </button>
        <button
          onClick={() => setType("Teacher")}
          className={`w-1/2 ${
            type === "Teacher"
              ? "text-black bg-white"
              : "bg-transparent text-gray-500"
          } transition-all duration-200 text-sm ease-in-out rounded-sm font-semibold`}
        >
          Teacher
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-6"
      >
        <div className="">
          <label htmlFor="accountType" className="lable-class">
            ACCOUNT TYPE{" "}
          </label>
          {type === "Student" && (
            <div className="flex gap-48 items-center">
              <div className="flex gap-1 items-center my-2">
                <input
                  type="radio"
                  {...register("accountType", { required: true })}
                  name="accountType"
                  id="student"
                  value="student"
                />
                <label htmlFor="student">Student</label>
              </div>
            </div>
          )}
          {type === "Teacher" && (
            <div className="flex gap-48 items-center">
              <div className="flex gap-1 items-center my-2 ">
                <input
                  value="teacher"
                  type="radio"
                  {...register("accountType", { required: true })}
                  name="accountType"
                  id="teacher"
                />
                <label htmlFor="teacher">teacher</label>
              </div>
            </div>
          )}
          {errors.accountType && (
            <span className="error-style">Account Type is Required</span>
          )}
        </div>
        {/* Username Field */}
        <div>
          <label htmlFor="userName" className="text-gray-700 font-semibold">
            Username
          </label>
          <input
            type="text"
            autoComplete="off"
            id="userName"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("userName", {
              required: { value: true, message: "Username is required" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+$/,
                message: "Invalid username",
              },
            })}
          />
          {errors.userName && (
            <span className="text-red-500">{errors.userName.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="text-gray-700 font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              id="password"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", {
                required: "Password is required",
                validate: validatePassword,
              })}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <LuEyeOff
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <LuEye
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-gray-700 font-semibold"
          >
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            id="confirmPassword"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Account Section */}
        <h3 className="text-lg font-bold mt-4">Accounts</h3>
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col gap-3"
            >
              <div>
                <label className="text-gray-700 font-semibold">
                  Account Name:
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={account.account_name}
                  onChange={(e) =>
                    handleAccountChange(index, "account_name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold">
                  Private Key:
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={account.privateKey}
                  onChange={(e) =>
                    handleAccountChange(index, "privateKey", e.target.value)
                  }
                  required
                />
              </div>
              <button
                type="button"
                className="w-1/4 text-white bg-red-500 px-3 py-2 rounded-md hover:bg-red-600 transition"
                onClick={() => handleRemoveAccount(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add Account Button */}
        <button
          type="button"
          onClick={handleAddAccount}
          className="w-1/4 text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition mt-3"
        >
          Add Account
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-xl mt-2 font-semibold text-white bg-blue-500 hover:scale-95 transition-all duration-300"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
