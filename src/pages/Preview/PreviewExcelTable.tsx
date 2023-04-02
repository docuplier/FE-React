import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material";

const PreviewExcelTable = ({
  isMobile,
  disableEmailToRecipient,
  tableHeaders,
  tableBody,
  exportAsExcel,
  onEmailToRecipient,
  onContinue,
  step,
  loading,
  theme,
  onPreviewClick,
}: {
  isMobile: boolean;
  disableEmailToRecipient: boolean;
  loading: boolean;
  tableHeaders: { field: string; title: string }[];
  tableBody: any[];
  exportAsExcel: () => void;
  onEmailToRecipient: () => void;
  onContinue: () => void;
  onPreviewClick: () => void;
  step: number;
  theme: Theme;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          position: "relative",
          mt: 2,
        }}
        p={6}
        className="long-dashed-border"
      >
        <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
          Recipients
        </Typography>
        <Box
          sx={{
            backgroundColor: "#0B0D27",
            mt: 2,
            maxHeight: "550px",
            overflowY: "scroll",
            scrollbarWidth: "thin",
            msOverflowStyle: "auto",
            "::-webkit-scrollbar": {
              display: "block",
              width: "4px",
              paddingBottom: "15rem",
              height: "5px !important",
              backgroundColor: "#0B0D27",
            },

            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#7682F5",
              borderRadius: "10px",
              height: "5px",
            },
          }}
        >
          {" "}
          <TableContainer component={Paper}>
            <Table
              sx={{
                minWidth: isMobile ? 300 : 650,
                backgroundColor: (theme) => theme.palette.common.black,
                height: "0vh",
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {tableHeaders?.map((val: any) => (
                    <TableCell key={val.field}>{val.title}</TableCell>
                  ))}
                  {/* {rows?.map((props) => (
                    <TableCell>{props}</TableCell>
                  ))} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableBody?.map((row: any) => (
                  <TableRow
                    key={row?.recipient_full_name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },

                      padding: 0,
                    }}
                  >
                    <TableCell
                      component="td"
                      scope="row"
                      sx={{ color: !row?.recipient_full_name ? "red" : "" }}
                    >
                      {row?.recipient_full_name || (
                        <Typography
                          variant="overline"
                          color="red"
                          fontStyle="italic"
                          textTransform="capitalize"
                        >
                          [Missing Field]
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {row?.recipient_email_address || (
                        <Typography
                          variant="overline"
                          color="red"
                          fontStyle="italic"
                          textTransform="capitalize"
                        >
                          [Missing Field]
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        marginTop="30px"
      >
        <>
          {isMobile ? (
            <Button
              sx={{
                width: "200px",
                height: "40px",
                mr: 4,
                mb: 4,
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
              Download
            </Button>
          ) : (
            <Button
              onClick={() => navigate(-1)}
              size="small"
              sx={{
                width: "200px",
                height: "48px",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Upload New List
            </Button>
          )}
        </>

        <Box display="flex">
          <Button
            sx={{
              width: "150px",
              height: "40px",
              mr: 4,
              mb: 4,
              border: "1px solid #fff",
              color: "#fff",
              display: isMobile ? "none" : "flex",
              "& .MuiButtonBase-root": {
                backgroundColor: "red",
              },
              "&:hover": {
                border: "none",
              },
            }}
            onClick={() => onPreviewClick()}
          >
            Preview
          </Button>{" "}
          {/* <Button
            sx={{
              width: "200px",
              height: "40px",
              mr: 4,
              mb: 4,
              border: "1px solid #fff",
              color: "#fff",
              display: isMobile ? "none" : "flex",
              "& .MuiButtonBase-root": {
                backgroundColor: "red",
              },
              "&:hover": {
                border: "none",
              },
            }}
            onClick={() => exportAsExcel()}
          >
            Download to Print
          </Button>{" "} */}
          {step > 1 ? (
            <Button
              variant="contained"
              sx={{ px: 20, height: "40px", mb: 4 }}
              onClick={onContinue}
              disableElevation
              disableFocusRipple
              disableRipple
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ width: "200px", height: "40px", mb: 4 }}
              onClick={onEmailToRecipient}
              disabled={disableEmailToRecipient}
            >
              Email to Recipients
            </Button>
          )}
        </Box>
      </Box>
      {isMobile && (
        <Box display="flex">
          <Button
            sx={{
              width: "100%",
              height: "40px",
              mr: 4,
              mb: 4,
              border: "1px solid #fff",
              color: "#fff",
              "&:hover": {
                border: "none",
              },
            }}
            onClick={() => onPreviewClick()}
          >
            Preview Certificate
          </Button>{" "}
        </Box>
      )}
    </>
  );
};

export default PreviewExcelTable;
