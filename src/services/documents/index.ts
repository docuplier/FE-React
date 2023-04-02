import { ENDPOINTS } from "constants/appConstants";
import { toast } from "react-toastify";
import Api from "services/apiService";
import ToastContent from "components/ToastContent/ToastContent";

export const fetchProducts = async () => {
  const res = await Api.get(`${ENDPOINTS.products}?status=true`);
  return res.data;
};

export const fetchIndenpontencyKey = async () => {
  const res = await Api.get(`${ENDPOINTS.idempotencyKey}`);
  return res.data;
};
export const fetchSystemDocs = async () => {
  const res = await Api.get(`${ENDPOINTS.getAllDocs}`);
  return res.data;
};
export const fetchSingleDocument = async ({
  doc,
  client,
}: {
  doc?: string;
  client?: string;
}) => {
  // /documents/:id/clients/:clientId/certificates
  const res = await Api.get(`${ENDPOINTS.getAllDocs}/${doc}/clients/${client}`);
  return res.data;
};

export const fetClientCert = async ({
  doc,
  client,
}: {
  doc?: string;
  client?: string;
}) => {
  const res = await Api.get(
    `${ENDPOINTS.getAllDocs}/${doc}/clients/${client}/certificates`,
    {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    }
  );
  const data = await res.data;
  const file = window.URL.createObjectURL(new Blob([data]));
  return file;
};

export const fetchOrgCerts = async ({ doc }: { doc?: string }) => {
  const res = await Api.get(`${ENDPOINTS.getAllDocs}/${doc}/certificates`, {});
  return res.data;
};

export const fetchOrgDocument = async ({
  // product,
  // owner,
  doc,
}: {
  doc: string;
  // product?: string;
  // owner?: string;
}) => {
  // const res = await Api.get(
  //   `${ENDPOINTS.getAllDocs}${product ? "?product=" + product : ""}${
  //     owner ? "&owner=" + owner : ""
  //   }`
  // );
  const res = await Api.get(`${ENDPOINTS.getAllDocs}/${doc}/certificates`);
  return res.data;
};

export const fetchOrgDocumentDetails = async ({
  product,
  owner,
  doc,
}: {
  doc: string;
  product?: string;
  owner?: string;
}) => {
  // const res = await Api.get(
  //   `${ENDPOINTS.getAllDocs}${product ? "?product=" + product : ""}${
  //     owner ? "&owner=" + owner : ""
  //   }`
  // );
  const res = await Api.get(`${ENDPOINTS.getAllDocs}/${doc}`);
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
// /:id/resend-email
export const resendOTP = async ({ payload, id }: any) => {
  const res = await Api.get(
    `${ENDPOINTS.resendOtp}/${id}/resend-email`,
    payload
  );
  return res.data;
};

export const completeProcess = async (payload: any) => {
  const res = await Api.post(ENDPOINTS.save, payload);
  return res.data;
};
