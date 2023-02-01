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
                  Issue:
                </Typography>
                <Typography variant="body2">STEMafrique Initiative</Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Recipient:
                </Typography>
                <Typography variant="body2">John Doe</Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Issue Date:
                </Typography>
                <Typography variant="body2">13th November, 2022</Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Certificate ID:
                </Typography>
                <Typography variant="body2">b777735678a</Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Description:
                </Typography>
                <Typography>
                  John Doe received this certificate for participation in
                  STEMafrique Initiative
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "#0B0D27",
                  p: 10,
                  ml: isMobile ? 0 : 8,
                }}
              >
                <Typography sx={{ fontSize: "24px" }}>
                  John Doe’s Certificate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ ml: isMobile ? 0 : 8 }}
              >
                {" "}
                <Button
                  sx={{
                    height: "48px",
                    border: "1px solid #fff",
                    color: "#fff",

                    "& .MuiButtonBase-root": {
                      backgroundColor: "red",
                    },
                    "&:hover": {
                      border: "none",
                    },
                  }}
                >
                  Share on LinkedIn
                </Button>
                <Button variant="contained" sx={{ height: "48px" }}>
                  Download PDF
                </Button>
              </Box>
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
