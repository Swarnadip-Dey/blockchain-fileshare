import { LOGIN_API, USER_SIGNUP_API, WALLET_API } from "../apis";
import { apiConnector } from "../apiConnector";
import axios from "axios";

export async function UserSignup(data) {
  try {
    const response = await axios.post(USER_SIGNUP_API, data, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response?.data?.id) {
      throw new Error(response?.data?.message || "Could Not Signup");
    }
    console.log(response.data);
    return response?.data;
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server Error:", err.response.data);
      alert(err.response.data.message);
      throw new Error(err.response.data.message || "Server Error");
    } else if (err.request) {
      // The request was made but no response was received
      console.error("Network Error:", err.request);
      throw new Error("Network Error - No response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", err.message);
      throw err;
    }
  }
}

export async function UserLogin(data1) {
  try {
    console.log("#111");
    const response = await apiConnector("POST", LOGIN_API, data1);
    console.log("#11");
    console.log(response);

    if (!response?.data) {
      throw new Error("No data received from server");
    }

    if (!response.data) {
      throw new Error(response.data.message || "Login failed");
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Server error occurred");
    } else if (error.request) {
      throw new Error("Network error - No response received");
    } else {
      throw error;
    }
  }
}

export const WalletLogin = async (data) => {
  try {
    const response = await apiConnector("POST", WALLET_API, data);
    return response.data;
  } catch (error) {
    console.error("Wallet login error:", error);
    return {
      error: error.response?.data?.message || "Wallet authentication failed",
    };
  }
};
