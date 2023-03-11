import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoWhite from "assets/logo-white.svg";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material";
import Footer from "components/Layout/Footer";
import { useEffect, useState } from "react";
import { fetchSingleDocument } from "services/documents";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import PageSpinner from "components/pageSpinner/PageSpinner";
import { format } from "date-fns";
import PreviewCert from "pages/Preview/PreviewCert";

const IndividualDocument = () => {
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
              <Typography variant="body1">General Information</Typography>
              <Box display="flex" mt={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Issuer:
                </Typography>
                <Typography variant="body2">
                  {singleDoc?.data?.orgName}
                </Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Recipient:
                </Typography>
                <Typography variant="body2">
                  {singleDoc?.data?.client?.name}
                </Typography>
              </Box>
              <Box display="flex" my={4}>
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
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Certificate ID:
                </Typography>
                <Typography variant="body2">{singleDoc?.data?._id}</Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Description:
                </Typography>
                <Typography>{singleDoc?.data?.emailText}</Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <PreviewCert
                fullName={singleDoc?.data?.client?.name}
                backText="Share on LinkedIn"
                // doc={`blob:${singleDoc?.data?.image?.src}`}
                doc={singleDoc?.data?.image?.src}
                // doc={new Blob([singleDoc?.data?.image?.src], "image/svg+xml")}
                isMobile={isMobile}
                selectedFont={singleDoc?.data?.fields[0]?.fontFamily}
                onBackClick={shareImage}
                imgSize={{
                  height: singleDoc?.data?.image?.height,
                  width: singleDoc?.data?.image?.width,
                }}
                dimension={{
                  bottom: singleDoc?.data?.fields[0]?.bottom?.$numberDecimal,
                  height: singleDoc?.data?.fields[0]?.height?.$numberDecimal,
                  left: singleDoc?.data?.fields[0]?.left?.$numberDecimal,
                  right: singleDoc?.data?.fields[0]?.right?.$numberDecimal,
                  top: singleDoc?.data?.fields[0]?.top?.$numberDecimal,
                  width: singleDoc?.data?.fields[0]?.width?.$numberDecimal,
                  x: singleDoc?.data?.fields[0]?.x?.$numberDecimal,
                  y: singleDoc?.data?.fields[0]?.y?.$numberDecimal,
                }}
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
