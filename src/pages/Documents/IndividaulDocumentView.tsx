import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoWhite from "assets/beta logo.png";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material";
import Footer from "components/Layout/Footer";
import { useEffect, useMemo, useState } from "react";
import { fetchSingleDocument, fetClientCert } from "services/documents";
import { useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import PageSpinner from "components/pageSpinner/PageSpinner";
import { format } from "date-fns";
import PreviewCert from "pages/Preview/PreviewCert";
import PreviewCertV2 from "pages/Preview/PreviewCertV2";

const IndividualDocument = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [URLParams, setURLParams] = useState({ client: "", doc: "" });

  const { data: singleDoc, isFetching: fetchingSingleDoc } = useQuery(
    "singleDoc",
    () => fetchSingleDocument({ ...URLParams }),
    {
      enabled: !!URLParams.client && !!URLParams.doc,
      onError: (e: AxiosError) => {
        const errData: any = e.response?.data;
        if (errData?.message) {
          toast(errData.message, {
            type: "error",
          });
        }
      },
      onSuccess: () => {
        queryClient.refetchQueries("clientCert");
      },
    }
  );

  const { data: clientCert, isFetching: fetchingClientCert } = useQuery(
    "clientCert",
    () => fetClientCert({ ...URLParams }),
    {
      enabled: !!URLParams.client && !!URLParams.doc,
      onError: (e: AxiosError) => {
        const errData: any = e.response?.data;
        if (errData?.message) {
          toast(errData.message, {
            type: "error",
          });
        }
      },
    }
  );

  useEffect(() => {
    let params = {};

    searchParams.forEach((value, param) => {
      // @ts-ignore
      params[param] = value;
    });

    // @ts-ignore
    setURLParams((prevState) => ({ ...prevState, ...params }));
  }, [searchParams]);

  const shareImage = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        `https://decuplier.netlify.app/certifcates?doc=${singleDoc?.data?._id}&client=${singleDoc?.data?.client?._id}`
      )}`
    );
  };

  if (fetchingSingleDoc) return <PageSpinner />;
  return (
    <Box
      px={isMobile ? 5 : 10}
      sx={{
        position: "relative",
        height: isMobile ? "100%" : "100vh",
        pt: theme.spacing(10),
        pb: theme.spacing(10),
      }}
    >
      <Grid container>
        <Grid item xs={12} md={3} sx={{ height: "100%", mr: 6 }}>
          <Stack spacing={6}>
            <Link to="/">
              <img src={LogoWhite} alt="" width={isMobile ? 126.8 : "50%"} />
            </Link>
            <Box display="flex" flexDirection="column" ml={4}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                General Information
              </Typography>
              <Box display="flex" my={3}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Issuer:
                </Typography>
                <Typography variant="body2">
                  {singleDoc?.data?.orgName}
                </Typography>
              </Box>
              <Box display="flex" my={3}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Recipient:
                </Typography>
                <Typography variant="body2">
                  {singleDoc?.data?.client
                    ? singleDoc?.data?.client?.name
                    : "--"}
                </Typography>
              </Box>
              <Box display="flex" my={3}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Issue Date:
                </Typography>
                <Typography variant="body2">
                  {singleDoc?.data?.createdAt
                    ? format(
                        new Date(singleDoc?.data?.createdAt),
                        "do MMMM, yyyy"
                      )
                    : "-"}
                </Typography>
              </Box>
              <Box display="flex" my={3}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Document ID:
                </Typography>
                <Typography variant="body2">{singleDoc?.data?._id}</Typography>
              </Box>
              {/* <Box display="flex" my={3}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Description:
                </Typography>
                <Typography>
                  {singleDoc?.data
                    ? singleDoc?.data?.emailText
                    : singleDoc?.data?.emailText == "undefined"
                    ? "--"
                    : "--"}
                </Typography>
              </Box> */}
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <PreviewCertV2
                fullName={singleDoc?.data?.client?.name}
                backText="Share on LinkedIn"
                docUrl={clientCert}
                isMobile={isMobile}
                onBackClick={shareImage}
                productName={singleDoc?.data?.product?.name}
                docType={""}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ mt: 10 }}>
        {" "}
        <Footer />
      </Box>
    </Box>
  );
};

export default IndividualDocument;

const ButtonBox = styled(Button)({
  "@media screen and (max-width:768px)": {
    display: "none",
  },
});
