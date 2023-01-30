import {
  useMediaQuery,
  useTheme,
  Modal,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import Dropzone from "components/Dropzone/Dropzone";
import React, { useState } from "react";
import { getImageSize } from "react-image-size";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { getPathByName } from "utils/getPathsByName";

const UploadDocument = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context: any = useOutletContext();

  console.log("mam", context.idempotencyKey);

  React.useEffect(() => {
    context?.setCurrentStep(0);
  }, []);

  // setTimeout(() => {
  //   setOpen(false);
  // }, 5000);

  const handleUpload = async (data: File) => {
    const imgUrl = URL.createObjectURL(data);
    const { width, height } = await getImageSize(imgUrl);
    context?.setUploaded((prev: any) => ({
      ...prev,
      doc: imgUrl,
      image: { src: data, width, height },
      dataFile: data,
    }));
    navigate(getPathByName(context.activeTab, 1));
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dropzone
        accept={{ "image/jpeg": [], "image/png": [], " .pdf": [] }}
        onUpload={handleUpload}
        theme={theme}
        title="PDF, PNG, JPEG files are supported"
      />

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          mt: 20,
          border: "none",
          outline: "0px",
          boxShadow: "none",
        }}
        disableAutoFocus
      >
        <Paper
          sx={{
            width: "720px",
            height: "500px",
            border: "none",
            px: 4,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "24px", fontWeight: 600, mt: 2 }}>
              How to use Docuplier in 30 secs
            </Typography>
            <Box width="700px" height="400px">
              hii
            </Box>
          </Box>
          <Box
            width="130px"
            height="40px"
            display={"flex"}
            justifyContent="center"
            alignItems={"center"}
            sx={{
              border: "1px solid #fff",
              borderRadius: 2,
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <Typography> Skip Intro Video</Typography>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default UploadDocument;
