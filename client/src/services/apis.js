const BASE_URL = process.env.VITE_APP_BASE_URL || "http://localhost:5678";

export const cBASE_URL = BASE_URL;
export const USER_SIGNUP_API = BASE_URL + "/api/v1/auth/signup";
export const LOGIN_API = BASE_URL + "/api/v1/auth/login";

export const GET_USER_DETAILS_API = BASE_URL + "/api/v1/user/me";

export const WALLET_API = BASE_URL + "/api/v1/auth/wallet-login";

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
