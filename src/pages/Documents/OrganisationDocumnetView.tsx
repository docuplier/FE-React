import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import Dropzone from "components/Dropzone/Dropzone";
import SharedStepper from "components/SharedStepper/SharedStepper";
import TabButtons from "components/TabButtons/TabButtons";
import LogoWhite from "assets/logo-white.svg";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "Routes";
import { styled } from "@mui/material";
import GoogleFontLoader from "react-google-font-loader";
import Footer from "components/Layout/Footer";
import { AxiosError } from "axios";
import { fetchOrgDocument } from "services/documents";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

const tabItems = [
  {
    id: 1,
    name: "Certificates",
  },
  {
    id: 2,
    name: "Badges",
  },
  {
    id: 3,
    name: "Tags",
  },
  {
    id: 4,
    name: "Invitations",
  },
];

const steps = [
  { value: 1, label: "Upload Design" },
  { value: 2, label: "Name Field" },
  { value: 3, label: "Upload List" },
  { value: 4, label: "Preview" },
];

const OrgansationDocumentView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const [URLParams, setURLParams] = useState({ orgId: "" });

  console.log("url", URLParams);

  function createData(name: string, email: string, view: string) {
    return { name, email, view };
  }

  const rows = ["Recipient Name", "Recipient Email", "Action"];

  const { data: orgDoc, isFetching: fetchingSingleDoc } = useQuery(
    "orgDoc",
    () => fetchOrgDocument({ ...URLParams }),
    {
      //enabled: !!URLParams.orgId,
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

  const data = [
    {
      name: "Henry",
      email: "henry@gmail.com",
      view: "view",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
      view: "view",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
      view: "view",
    },
  ];

  console.log("org", orgDoc);

  useEffect(() => {
    let params = {};

    searchParams.forEach((value, param) => {
      console.log("val", value);
      // @ts-ignore
      params[param] = value;
    });

    // @ts-ignore
    setURLParams((prevState) => ({ ...prevState, ...params }));
  }, [searchParams]);

  const list = data?.map(({ name, email, view }) =>
    createData(name, email, view)
  );

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
                  p: isMobile ? 5 : 10,
                  ml: isMobile ? 0 : 10,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {" "}
                  <Typography>Recipients</Typography>
                  <Box
                    sx={{
                      display: isMobile ? "none" : "flex",
                      justifyContent: isMobile ? {} : "flex-end",
                    }}
                  >
                    {" "}
                    <Button variant="contained" sx={{ height: "48px" }}>
                      Download All & Print
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#0B0D27",
                    mt: 8,
                    mb: 4,
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    msOverflowStyle: "auto",
                    "::-webkit-scrollbar": {
                      display: "block",
                      width: "4px",
                      paddingBottom: "15rem",
                      height: "5px !important",
                      backgroundColor: "#7682F5",
                    },

                    "::-webkit-scrollbar-thumb": {
                      backgroundColor: "white",
                      borderRadius: "10px",
                      height: "5px",
                    },
                  }}
                >
                  {" "}
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: isMobile ? 300 : 650 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          {rows?.map((props) => (
                            <TableCell>{props}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell
                              sx={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              {row.view}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box mx={5} display={isMobile ? "flex" : "none"}>
        {" "}
        <Button
          variant="contained"
          sx={{ height: "56px", width: "100%", fontSize: "1rem" }}
        >
          Download All & Print
        </Button>
      </Box>
      <Box sx={{ mt: 10 }}>
        {" "}
        <Footer />
      </Box>
    </Box>
  );
};

export default OrgansationDocumentView;

const ButtonBox = styled(Button)({
  "@media screen and (max-width:768px)": {
    display: "none",
  },
});
