import { lazy } from "react";

export const paths = {
  HOME: "/",
  MAIN: "/*",
  UPLOAD: "/document",
  CERTIFICATES: "/certificates",
  CERTIFICATES_UPLOAD: "/certificates/upload",
  CERTIFICATES_NAME: "/certificates/name-field",
  CERTIFICATES_UPLOAD_LIST: "/certificates/upload-list",
  CERTIFICATES_PREVIEW: "/certificates/preview",
  CERTIFICATES_SUCCESS: "/certificates/success",
  SIGNIN: "/signin",
  BADGES: "/badges",
  BADGES_UPLOAD: "/badges/upload",
  BADGES_NAME: "/badges/name-field",
  BADGES_UPLOAD_LIST: "/badges/upload-list",
  BADGES_PREVIEW: "/badges/preview",
  BADGES_SUCCESS: "/badges/success",

  TAGS: "/tags",
  TAGS_UPLOAD: "/tags/upload",
  TAGS_NAME: "/tags/name-field",
  TAGS_UPLOAD_LIST: "/tags/upload-list",
  TAGS_PREVIEW: "/tags/preview",
  TAGS_SUCCESS: "/tags/success",

  INVITATIONS: "/invitations",
  INVITATIONS_UPLOAD: "/invitations/upload",
  INVITATIONS_NAME: "/invitations/name-field",
  INVITATIONS_UPLOAD_LIST: "/invitations/upload-list",
  INVITATIONS_PREVIEW: "/invitations/preview",
  INVITATIONS_SUCCESS: "/invitations/success",
  INDIVIDUAL_CERTIFICATES: "/document",
  ORGANSATION_CERTIFICATES: "/organisation-document",
};

const routes = {
  main: [
    {
      path: paths.SIGNIN,
      exact: true,
      component: lazy(() => import("../pages/Auth/Login")),
    },
    {
      path: paths.HOME,
      exact: true,
      component: lazy(() => import("../pages/Landing/Landing")),
    },
    {
      path: paths.INDIVIDUAL_CERTIFICATES,
      exact: true,
      component: lazy(
        () => import("../pages/Documents/IndividaulDocumentView")
      ),
    },
    {
      path: paths.ORGANSATION_CERTIFICATES,
      exact: true,
      component: lazy(
        () => import("../pages/Documents/OrganisationDocumnetView")
      ),
    },
    {
      path: "*",
      exact: true,
      component: lazy(() => import("../pages/NotFound/NotFound")),
    },
  ],
  certificates: {
    path: paths.CERTIFICATES,
    exact: true,
    children: [
      {
        path: paths.CERTIFICATES_UPLOAD,
        exact: true,
        component: lazy(() => import("../pages/UploadDocument/UploadDocument")),
      },
      {
        path: paths.CERTIFICATES_NAME,
        exact: true,
        component: lazy(() => import("../pages/TextField/AddText")),
      },
      {
        path: paths.CERTIFICATES_UPLOAD_LIST,
        exact: true,
        component: lazy(() => import("../pages/UploadList/UploadList")),
      },
      {
        path: paths.CERTIFICATES_PREVIEW,
        exact: true,
        component: lazy(() => import("../pages/Preview/Preview")),
      },
      {
        path: paths.CERTIFICATES_SUCCESS,
        exact: true,
        component: lazy(() => import("../pages/Success/Success")),
      },
    ],
  },
  badges: {
    path: paths.BADGES,
    exact: true,
    children: [
      {
        path: paths.BADGES_UPLOAD,
        exact: true,
        component: lazy(() => import("../pages/UploadDocument/UploadDocument")),
      },
      {
        path: paths.BADGES_NAME,
        exact: true,
        component: lazy(() => import("../pages/TextField/AddText")),
      },
      {
        path: paths.BADGES_UPLOAD_LIST,
        exact: true,
        component: lazy(() => import("../pages/UploadList/UploadList")),
      },
      {
        path: paths.BADGES_PREVIEW,
        exact: true,
        component: lazy(() => import("../pages/Preview/Preview")),
      },
      {
        path: paths.BADGES_SUCCESS,
        exact: true,
        component: lazy(() => import("../pages/Success/Success")),
      },
    ],
  },

  tags: {
    path: paths.TAGS,
    exact: true,
    children: [
      {
        path: paths.TAGS_UPLOAD,
        exact: true,
        component: lazy(() => import("../pages/UploadDocument/UploadDocument")),
      },
      {
        path: paths.TAGS_NAME,
        exact: true,
        component: lazy(() => import("../pages/TextField/AddText")),
      },
      {
        path: paths.TAGS_UPLOAD_LIST,
        exact: true,
        component: lazy(() => import("../pages/UploadList/UploadList")),
      },
      {
        path: paths.TAGS_PREVIEW,
        exact: true,
        component: lazy(() => import("../pages/Preview/Preview")),
      },
      {
        path: paths.TAGS_SUCCESS,
        exact: true,
        component: lazy(() => import("../pages/Success/Success")),
      },
    ],
  },
  invitations: {
    path: paths.INVITATIONS,
    exact: true,
    children: [
      {
        path: paths.INVITATIONS_UPLOAD,
        exact: true,
        component: lazy(() => import("../pages/UploadDocument/UploadDocument")),
      },
      {
        path: paths.INVITATIONS_NAME,
        exact: true,
        component: lazy(() => import("../pages/TextField/AddText")),
      },
      {
        path: paths.INVITATIONS_UPLOAD_LIST,
        exact: true,
        component: lazy(() => import("../pages/UploadList/UploadList")),
      },
      {
        path: paths.INVITATIONS_PREVIEW,
        exact: true,
        component: lazy(() => import("../pages/Preview/Preview")),
      },
      {
        path: paths.INVITATIONS_SUCCESS,
        exact: true,
        component: lazy(() => import("../pages/Success/Success")),
      },
    ],
  },
};

export default routes;
