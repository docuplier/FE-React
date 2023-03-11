import {
  Box,
  Button,
  Grid,
  Stack,
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
  CircularProgress,
} from "@mui/material";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import LogoWhite from "assets/logo-white.svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "Routes";
import { styled } from "@mui/material";
import Footer from "components/Layout/Footer";
import { AxiosError } from "axios";
import { fetchOrgDocument } from "services/documents";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";

const OrgansationDocumentView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const [URLParams, setURLParams] = useState({
    product: "",
    owner: "",
    doc: "",
  });


  const rows = ["Recipient Name", "Recipient Email", "Action"];

  const { data: orgDoc, isFetching: fetchingOrgDoc } = useQuery(
    "orgDocument",
    () => fetchOrgDocument({ ...URLParams }),
    {
      enabled: !!URLParams?.doc,
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

  useEffect(() => {
    let params = {};

    searchParams.forEach((value, param) => {
      // @ts-ignore
      params[param] = value;
    });

    // @ts-ignore
    setURLParams((prevState) => ({ ...prevState, ...params }));
  }, [searchParams]);

  const exportAsExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
    const ext = ".xlsx";
    const objKeys = Object.keys(orgDoc?.data[0]?.clients[0]);

    const body = orgDoc?.data[0]?.clients.map((v: any) => {
      let itm: any = {};
      objKeys.forEach((key) => {
        itm[key.replaceAll("_", " ")?.toUpperCase()] = v[key];
      });
      return itm;
    });
    const ws = utils.json_to_sheet(body);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `recipients${ext}`);
  };

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
                  {orgDoc?.data[0]?.orgName}
                </Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Number of Recipients:
                </Typography>
                <Typography variant="body2">
                  {orgDoc?.data[0]?.clients?.length}
                </Typography>
              </Box>
              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Issue Date:
                </Typography>
                <Typography variant="body2">
                  {orgDoc?.data[0]?.createdAt
                    ? format(
                        new Date(orgDoc?.data[0]?.createdAt),
                        "do MMMM, yyyy"
                      )
                    : "-"}
                </Typography>
              </Box>

              <Box display="flex" my={4}>
                <Typography variant="body2" sx={{ mr: 2, color: "#8F9099" }}>
                  Description:
                </Typography>
                <Typography>{orgDoc?.data[0]?.emailText}</Typography>
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
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => exportAsExcel()}
                    >
                      Download All & Print
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.dark,
                    mt: 8,
                    mb: 4,
                  }}
                >
                  <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table
                      stickyHeader
                      sx={{
                        minWidth: isMobile ? 300 : 650,
                        backgroundColor: (theme) => theme.palette.primary.dark,
                        height: "0vh",
                      }}
                      aria-label="Orgnanisation clients' table"
                    >
                      <TableHead>
                        <TableRow>
                          {rows.map((row) => (
                            <TableCell
                              sx={{
                                backgroundColor: (theme) =>
                                  theme.palette.primary.dark,
                              }}
                              key={row}
                            >
                              {row}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fetchingOrgDoc ? (
                          <TableRow>
                            <TableCell
                              component="td"
                              scope="row"
                              colSpan={3}
                              rowSpan={3}
                            >
                              <Box
                                width="100%"
                                height="400px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <CircularProgress color="primary" />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {orgDoc?.data[0]?.clients?.map((row: any) => (
                              <TableRow
                                key={row?._id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },

                                  padding: 0,
                                }}
                              >
                                <TableCell component="td" scope="row">
                                  {row?.name || "-"}
                                </TableCell>
                                <TableCell>{row?.email || "-"}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                      color: theme.palette.common.white,
                                      p: 0,
                                      minWidth: "auto",
                                      "&:hover": {
                                        background: "transparent",
                                        textDecoration: "underline",
                                      },
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `${paths.INDIVIDUAL_CERTIFICATES}?doc=${orgDoc?.data[0]?._id}&client=${row?._id}`
                                      )
                                    }
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        )}
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
          onClick={() => exportAsExcel()}
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
