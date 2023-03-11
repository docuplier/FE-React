import {
  useMediaQuery,
  useTheme,
  Modal,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import Dropzone from "components/Dropzone/Dropzone";
import React, { useState } from "react";
import { getImageSize } from "react-image-size";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { getPathByName } from "utils/getPathsByName";
import { useQuery } from "react-query";
import ReactPlayer from "react-player";

const w = window as any;
const PDFJS = w.pdfjsLib;

const UploadDocument = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(location?.state?.open);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context: any = useOutletContext();

  React.useEffect(() => {
    context?.setCurrentStep(0);
  }, []);

  const handleUpload = async (data: File) => {
    if (data.type === "application/pdf") {
      const uri = URL.createObjectURL(data);
      var _PDF_DOC = await PDFJS.getDocument({ url: uri });
      await context?.setUploaded((prev: any) => ({
        ...prev,
        pdfDoc: _PDF_DOC,
        doc: "",
        image: { src: data },
        dataFile: data,
      }));
      navigate(getPathByName(context.activeTab, 1));
      return;
    }
    const imgUrl = URL.createObjectURL(data);
    const { width, height } = await getImageSize(imgUrl);
    context?.setUploaded((prev: any) => ({
      ...prev,
      doc: imgUrl,
      image: {
        src: data,
        width,
        height,
      },
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
        accept={{ "image/jpeg": [], "image/png": [], "application/pdf": [] }}
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
          alignItems: "center",
          border: "none",
          outline: "0px",
          boxShadow: "none",
        }}
        disableAutoFocus
      >
        <Paper
          sx={{
            width: isMobile ? "90%" : "50%",
            height: "490px",
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
            height="470px"
            width="100%"
            mb={5}
          >
            <Typography
              sx={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 600,
                my: 2,
              }}
            >
              How to use Docuplier in 30 secs
            </Typography>
            <Box width="100%" height="100%" position="relative">
              <ReactPlayer
                url="https://www.youtube.com/watch?v=mjkvZbSRkOg"
                playing
                controls
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </Box>
          </Box>
          <Box
            mb={4}
            display="flex"
            justifyContent="center"
            alignItems={"center"}
          >
            <Button variant="outlined" onClick={handleClose}>
              {" "}
              Skip Intro Video
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default UploadDocument;
