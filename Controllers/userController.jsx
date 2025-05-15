import axios from "axios";
import { API } from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userLogin = async (userData) => {
  const postData = {
    emailOrMobile: userData.email,
    password: userData.password,
  };

  const response = await axios.post(`${API.url}login`, postData);
  return response;
};

export const GetUserDetails = async () => {
  try {
    const email = await AsyncStorage.getItem("email");
    const bearerToken = await AsyncStorage.getItem("token");

    if (!email || !bearerToken) {
      throw new Error("Missing authentication information.");
    }

    const postData = { email };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}get-user-details`,
      postData,
      axiosConfig
    );

    return response;
  } catch (error) {
    await AsyncStorage.multiRemove(["token", "email"]);

    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || "Unknown error",
    };
  }
};

export const AddCryptoDepositRequest = async (formData) => {
  const email = await AsyncStorage.getItem("email");
  const bearerToken = await AsyncStorage.getItem("token");

  if (!email || !bearerToken) {
    throw new Error("Missing authentication information.");
  }

  const postData = new FormData();

  postData.append("amount", formData.amount);
  postData.append("transection_hash", formData.transection_id);
  postData.append("image", formData.image);
  postData.append("deposit_to", formData.deposit_to);
  postData.append("email", email);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}add-deposit-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.log("errordd", error);
    throw error;
  }
};

export const GetAccountAllStatement = async () => {
  const email = await AsyncStorage.getItem("email");
  const bearerToken = await AsyncStorage.getItem("token");

  const postData = {
    email: email,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}get-statement`,
    postData,
    axiosConfig
  );
  return response.data;
};

export const MinesGameUpdateWallet = async (formData) => {
  const amount = formData.amount;
  const type = formData.type;
  const game_type = formData.game_type;
  const details = formData.details || {};

  const data = {
    amount,
    type,
    game_type,
    details,
  };

  const secretKey = process.env.REACT_APP_WALLET_UPDATE_KEY;

  const encodedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();

  const postData = {
    email: email,
    data: encodedData,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}deduct-game-wallet`,
    postData,
    axiosConfig
  );

  return response.data;
};
