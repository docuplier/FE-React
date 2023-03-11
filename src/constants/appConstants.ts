import { paths } from "Routes";

export const MOCK_OWNER = "63959ebb849d5b9b485e419a";
export const MOCK_DOCUMENT = "6395ad1284ec32a18cf4f569";

export const BASE_URL = "https://docuplier.com/api/v1";

export const ENDPOINTS = {
  products: "/products",
  idempotencyKey: "/documents/idempotency-key",
  signup: "/users/signup",
  verifyOtp: "/users/verify",
  save: "/documents",
  getAllDocs: "/documents",
};

export const DOCUMENT_TABS = [
  {
    id: 1,
    name: "Certificates",
    path: paths.CERTIFICATES,
  },
  {
    id: 2,
    name: "Badges",
    path: paths.BADGES,
  },
  {
    id: 3,
    name: "Tags",
    path: paths.TAGS,
  },
  {
    id: 4,
    name: "Invitations",
    path: paths.INVITATIONS,
  },
];

export const CERTIFICATE_STEPS = [
  { value: 1, label: "Upload Design", path: paths.CERTIFICATES_UPLOAD },
  { value: 2, label: "Name Field", path: paths.CERTIFICATES_NAME },
  { value: 3, label: "Upload List", path: paths.CERTIFICATES_UPLOAD_LIST },
  { value: 4, label: "Preview", path: paths.CERTIFICATES_PREVIEW },
];

export const FONTS = [
  {
    label: "Default",
    value: "'Nunito', sans-serif;",
  },
  { label: "Dosis", value: "'Dosis', sans-serif" },
  {
    label: "EB Garamond",
    value: "'EB Garamond', serif",
  },
  {
    label: "Fira Sans",
    value: "'Fira Sans', sans-serif",
  },
  {
    label: "Lato",
    value: "'Lato', sans-serif",
  },
  {
    label: "Libre Baskerville",
    value: "''Libre Baskerville', serif",
  },
  {
    label: "Libre Caslon Text",
    value: "'Libre Caslon Text', serif",
  },
  {
    label: "Martian Mono",
    value: "'Martian Mono', monospace",
  },
  {
    label: "Merriweather",
    value: "'Merriweather', serif",
  },
  {
    label: "Montserrat",
    value: "'Montserrat', sans-serif",
  },
  {
    label: "Open Sans",
    value: "'Open Sans', sans-serif",
  },
  {
    label: "PT Serif",
    value: "'PT Serif', serif",
  },
];

export const FONTSSIZE = [
  { label: "10", value: 10 },
  {
    label: "12",
    value: 12,
  },
  {
    label: "13",
    value: 13,
  },
  {
    label: "14",
    value: 14,
  },
  {
    label: "15",
    value: 15,
  },
  {
    label: "16",
    value: 16,
  },
  {
    label: "17",
    value: 17,
  },
  {
    label: "18",
    value: 18,
  },
  {
    label: "19",
    value: 19,
  },
  {
    label: "20",
    value: 20,
  },
  {
    label: "21",
    value: 21,
  },
  {
    label: "22",
    value: 22,
  },
  {
    label: "24",
    value: 24,
  },
  {
    label: "28",
    value: 28,
  },
  {
    label: "30",
    value: 30,
  },
  {
    label: "32",
    value: 32,
  },
  {
    label: "34",
    value: 34,
  },
  { label: "38", value: 38 },
  {
    label: "40",
    value: 40,
  },
];

export const EXCEL_TEMPLATE_DATA = [
  {
    "Recipient Full Name": "Michael Jackson",
    "Recipient Email Address": "john.doe@gmail.com",
  },
  {
    "Recipient Full Name": "Jane Martha Darwin",
    "Recipient Email Address": "jmd@mailinator.com",
  },
];
