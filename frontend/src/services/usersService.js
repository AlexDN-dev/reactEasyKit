import axios from "axios";
import { removeFromLocalStorage } from "../utils/usersUtils";

const server = import.meta.env.VITE_SERVER_ADDRESS;

export const signUpUser = async (user) => {
  try {
    const response = await axios.post(server + "/users", user);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const logInUser = async (user) => {
  try {
    const response = await axios.post(server + "/users/login", user);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getUserInformations = async (token) => {
  try {
    const response = await axios.get(server + "/users/getInformations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    removeFromLocalStorage("reactTemplate-token");
    return error;
  }
};
export const setupOTP = async (token) => {
  try {
    const response = await axios.post(server + "/users/setupOTP", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    removeFromLocalStorage("reactTemplate-token");
    return error;
  }
};
export const confirmOTP = async (token, code, secret) => {
  try {
    const response = await axios.post(
      server + "/users/confirmOTP",
      {
        code: code,
        secret: secret,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Invalid OTP") {
      return false;
    }
  }
};
export const removeOTP = async (code, token) => {
  try {
    const response = await axios.post(
      server + "/users/removeOTP",
      {
        code: code,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Invalid OTP") {
      return false;
    }
  }
};
export const needOTP = async (code, user) => {
  try {
    const response = await axios.post(server + "/users/needOTP", {
      code: code,
      user: user,
    });
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Invalid OTP") {
      return false;
    }
  }
};
