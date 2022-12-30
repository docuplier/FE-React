import { ENDPOINTS } from "constants/appConstants";
import Api from "services/apiService";

export const fetchProducts = async () => {
  const res = await Api.get(`${ENDPOINTS.products}?status=true`);
  return res.data;
};

export const fetchIndenpontencyKey = async () => {
  const res = await Api.get(`${ENDPOINTS.indenpontencyKey}`);
  return res.data;
};

export const signupEmail = async (payload: any) => {
  const res = await Api.post(ENDPOINTS.signup, payload);
  return res.data;
};

export const verifyOTP = async (payload: any) => {
  const res = await Api.post(ENDPOINTS.verifyOtp, payload);
  return res.data;
};

export const completeProcess = async (payload: any) => {
  const res = await Api.post(ENDPOINTS.save, payload);
  return res.data;
};
