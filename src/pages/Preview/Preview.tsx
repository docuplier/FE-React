import {
  Box,
  Button,
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
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import SetupEmailModal from "components/SetupEmailModal/SetupEmailModal";
import React, { useState } from "react";
import OtpModal from "components/otpModal/OtpModal";
import SetupEmailTemplateModal from "components/SetupEmailTemplateModal/SetupEmailTemplateModal";
import { paths } from "Routes";
import { checkMissingFields } from "utils/validateExcel";
import { completeProcess, signupEmail, verifyOTP } from "services/documents";
import { json } from "stream/consumers";

export interface IModalControl {
  openOtp: boolean;
  openEmailSetup: boolean;
  openEmailTemplateSetup: boolean;
  setupEmailPayload: { name: string; email: string } | null;
  step: number;
  otpError: boolean;
}

const Preview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const context: any = useOutletContext();
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [owner, setOwner] = useState<any>();
  const [modalControl, setModalControl] = useState<IModalControl>({
    openOtp: false,
    openEmailSetup: false,
    openEmailTemplateSetup: false,
    setupEmailPayload: null,
    step: 1,
    otpError: false,
  });

  const { mutate, isLoading: isCreating } = useMutation(signupEmail, {
    onError: (error: AxiosError) => {
      console.log(error.message);
      toast(
        error?.message || "Something went wrong while trying to send request",
        {
          type: "error",
        }
      );
    },
    onSuccess: (resp: any) => {
      toast(
        resp?.message || `Success: An OTP has been sent to ${resp.data.email}`,
        {
          type: "success",
        }
      );
      // context?.setUploaded((prev: any) => ({
      //   ...prev,
      //   owner: resp?.data,
      // }));
      setOwner(resp?.data);

      setModalControl((prev) => ({
        ...prev,
        openEmailSetup: false,
        setupEmailPayload: { email: resp?.data?.email, name: resp?.data?.name },
        step: 2,
      }));
    },
  });

  const { mutate: verifyOtp, isLoading: verifyingOtp } = useMutation(
    verifyOTP,
    {
      onError: (error: AxiosError) => {
        console.log(error.message);
        toast(
          error?.message || "Something went wrong while trying to send request",
          {
            type: "error",
          }
        );
        setModalControl((prev) => ({
          ...prev,
          otpError: true,
        }));
      },
      onSuccess: (resp: any) => {
        toast(
          resp?.message ||
            `Success: An OTP has been sent to ${resp.data.email}`,
          {
            type: "success",
          }
        );
        setModalControl((prev) => ({
          ...prev,
          openOtp: false,
          step: ++prev.step,
        }));
      },
    }
  );

  const { mutate: saveData, isLoading: completingProcess } = useMutation(
    completeProcess,
    {
      onError: (error: AxiosError) => {
        console.log(error.message);
        toast.error(
          error?.message || "Something went wrong while trying to send request"
        );
      },
      onSuccess: (resp: any) => {
        toast.success(resp?.message || `Success: Data saved!`);
        return navigate(paths.CERTIFICATES_SUCCESS);
      },
    }
  );

  React.useEffect(() => {
    context?.setCurrentStep(3);
    //  parseFile(context)
    if (!context?.uploaded?.tableData) {
      navigate("/");
    }
  }, []);

  function createData(name: string, email: string) {
    return { name, email };
  }

  const data = [
    {
      name: "Henry",
      email: "henry@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
    {
      name: "Henry",
      email: "henry@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
    {
      name: "Henry",
      email: "henry@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
    {
      name: "Henry",
      email: "henry@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
    {
      name: "Henry",
      email: "henry@gmail.com",
    },
    {
      name: "Chibuike",
      email: "chibuike@gmail.com",
    },
    {
      name: "Judith",
      email: "judith@gmail.com",
    },
  ];

  const handleContinue = () => {
    if (modalControl.step === 2 || modalControl.step === 4)
      return setModalControl((prev) => ({
        ...prev,
        openOtp: true,
      }));

    if (modalControl.step === 3)
      return setModalControl((prev) => ({
        ...prev,
        openEmailTemplateSetup: true,
      }));
    if (modalControl.step > 4) {
      const uploaded = context?.uploaded;

      const product = context?.products && context?.products[0];
      console.log("context", context);
      console.log("uploaded", uploaded);
      const image = context?.uploaded;
      const formData = new FormData();
      formData.append("orgName", uploaded?.orgName);
      formData.append("description", uploaded?.description);

      formData.append("docImage", image?.image?.src, image?.dataFile?.name);
      formData.append(
        "image",
        JSON.stringify({
          width: image?.image?.width,
          height: image?.image?.height,
        })
      );

      formData.append("product", product?._id);
      formData.append("owner", owner?._id);
      formData.append("fieldName", "name");
      formData.append("fontFamily", uploaded?.selectedFont);
      formData.append("width", uploaded?.dimension?.width);
      formData.append("height", uploaded?.dimension?.height);
      formData.append("top", uploaded?.dimension?.top);
      formData.append("bottom", uploaded?.dimension?.bottom);
      formData.append("left", uploaded?.dimension?.left);
      formData.append("right", uploaded?.dimension?.right);
      formData.append("x", uploaded?.dimension?.x);
      formData.append("y", uploaded?.dimension?.y);

      formData.append(
        "clients",
        JSON.stringify(
          uploaded?.tableData?.body?.map(
            (v: {
              recipient_email_address: string;
              recipient_full_name: string;
            }) => ({
              email: v.recipient_email_address,
              name: v.recipient_full_name,
            })
          )
        )
      );
      saveData(formData);
    }
  };

  const list = data?.map(({ name, email }) => createData(name, email));

  return (
    <Stack spacing={12}>
      <Box
        sx={{
          border: `2px dashed ${theme.palette.common.white}`,
          borderRadius: "8px",
          position: "relative",
          mt: 2,
        }}
        p={6}
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
                  {context?.uploaded?.tableData?.headers?.map((val: any) => (
                    <TableCell key={val.field}>{val.title}</TableCell>
                  ))}
                  {/* {rows?.map((props) => (
                    <TableCell>{props}</TableCell>
                  ))} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {context?.uploaded?.tableData?.body?.map((row: any) => (
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
          >
            Download to Print
          </Button>{" "}
          {modalControl.step > 1 ? (
            <Button
              variant="contained"
              sx={{ px: 6, height: "40px", mb: 4 }}
              onClick={handleContinue}
              disableElevation
              disableFocusRipple
              disableRipple
              disabled={completingProcess}
              startIcon={completingProcess && <CircularProgress size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ width: "200px", height: "40px", mb: 4 }}
              onClick={() =>
                setModalControl((prev) => ({ ...prev, openEmailSetup: true }))
              }
              disabled={checkMissingFields(context?.uploaded?.tableData?.body)}
            >
              Email to Recipients
            </Button>
          )}
        </Box>
        <SetupEmailModal
          productName={context?.products?.[0]?.name}
          open={modalControl.openEmailSetup}
          onClose={() =>
            setModalControl((prev) => ({ ...prev, openEmailSetup: false }))
          }
          onConfirm={(payload) => mutate(payload)}
          onInputChange={(e: any) => console.log(e)}
          loading={isCreating}
        />
        <OtpModal
          error={modalControl.otpError}
          open={modalControl.openOtp}
          onClose={() =>
            setModalControl((prev) => ({ ...prev, openOtp: false, step: 4 }))
          }
          onConfirm={(data: any) => verifyOtp({ token: data })}
          loading={verifyingOtp}
          onInputChange={(e: any) =>
            setModalControl((prev) => ({
              ...prev,
              otpError: false,
            }))
          }
          onResend={() => mutate(modalControl.setupEmailPayload)}
        />
        <SetupEmailTemplateModal
          loading={savingTemplate}
          open={modalControl.openEmailTemplateSetup}
          onClose={() =>
            setModalControl((prev) => ({
              ...prev,
              openEmailTemplateSetup: false,
            }))
          }
          onConfirm={() => {
            setSavingTemplate(true);
            setTimeout(() => {
              setSavingTemplate(false);
              toast.success("Template Created Successfully");
              setModalControl((prev) => ({
                ...prev,
                openEmailTemplateSetup: false,
                step: 5,
              }));
            }, 2500);
          }}
          onInputChange={(e: any) => console.log(e)}
          onResend={() => console.log("resend clicked")}
          isMobile={isMobile}
        />
      </Box>
    </Stack>
  );
};

export default Preview;
