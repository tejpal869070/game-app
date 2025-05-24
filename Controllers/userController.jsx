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

export const CheckToken = async () => {
  try {
    const bearerToken = await AsyncStorage.getItem("token");

    const postData = {
      email: await AsyncStorage.getItem("email"),
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}check-token`,
      postData,
      axiosConfig
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const CheckUserExistance = async (formData) => {
  const postData = {
    mobile: formData.mobile,
    email: formData.email,
  };

  const response = await axios.post(`${API.url}check-user-existance`, postData);
  return response;
};

export const SendOtp = async (formData) => {
  const dataToSend = {
    email: formData.email,
  };
  const response = await axios.post(`${API.url}send-otp`, dataToSend);
  console.log(response.data);
  return response.data;
};

export const userRegistration = async (formData) => {
  const postData = {
    user_name: formData.name,
    mobile: formData.mobile,
    password: formData.password,
    email: formData.email,
  };

  const response = await axios.post(`${API.url}register`, postData);

  return response;
};

export const verifyOtp = async (formData) => {
  try {
    const postData = {
      otp: formData.otp,
      email: formData.email,
    };
    const response = await axios.post(`${API.url}verify-otp`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (formData) => {
  try {
    const postData = {
      email: formData.email, 
      password: formData.password,
    };
    const response = await axios.post(`${API.url}reset-password`, postData);
    return response;
  } catch (error) { 
    throw error;
  }
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

  const postData = {
    amount: formData.amount,
    transection_hash: formData.transection_id,
    deposit_to: formData.deposit_to,
    email: email,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
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
    console.log("errordd", error.response?.data || error.message);
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

export const AddCryptoWithdrawalRequest = async (formData, pin) => {
  try {
    const email = await AsyncStorage.getItem("email");
    const bearerToken = await AsyncStorage.getItem("token");
    const postData = {
      email: email,
      amount: formData.amount,
      pin: pin,
      withdrawal_address: formData.address,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    const response = await axios.post(
      `${API.url}add-withdrawal-request`,
      postData,
      axiosConfig
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const CreateAccountPin = async (pin) => {
  try {
    const bearerToken = await AsyncStorage.getItem("token");

    const postData = {
      email: await AsyncStorage.getItem("email"),
      pin: pin,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}create-pin`,
      postData,
      axiosConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const PinVerification = async (pin) => {
  try {
    const bearerToken = await AsyncStorage.getItem("token");

    const dataToSent = {
      pin: pin,
      email: await AsyncStorage.getItem("email"),
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}verify-pin`,
      dataToSent,
      axiosConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
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
