import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import { useOutletContext } from "react-router-dom";
import html2canvas from "html2canvas";
import LogoWhite from "assets/beta logo.png";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { LinearProgress } from "@mui/material";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const removeTextLayerOffset = () => {
  const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
  textLayers.forEach((layer) => {
    // @ts-ignore
    const { style } = layer;
    style.top = "0";
    style.left = "0";
    style.transform = "";
  });
};

const PreviewCertV2 = ({
  fullName,
  productName,
  isMobile,
  docUrl,
  onBackClick,
  backText,
  docType,
  separateButtons,
}: {
  fullName: string;
  productName: string;
  isMobile: boolean;
  docUrl: string | undefined;
  onBackClick: (data: any) => void;
  backText?: string;
  docType: string;
  separateButtons?: boolean;
}) => {
  const theme = useTheme();
  // const isMobmatchesile = useMediaQuery(theme.breakpoints.down("sm"));
  const matches = useMediaQuery("(max-width:320px)");
  const ref = useRef<HTMLDivElement>();
  const printDocument = async (e: any) => {
    e.preventDefault();
    const input = document.getElementById("certificate-container");
    if (input) {
      html2canvas(input, { useCORS: true }).then((canvas: any) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          format: docType === "application/pdf" ? "a3" : "a4",
        });

        pdf.addImage(imgData, "PNG", 0, 0, 0, 0);
        pdf.save("download.pdf");
      });
    }
  };
  const handleBack = async (e: any) => {
    e.preventDefault();
    const input = document.getElementById("certificate-container");
    if (input) {
      html2canvas(input, { useCORS: true }).then((canvas: any) => {
        const imgData = canvas.toDataURL("image/png");

        onBackClick(imgData);
        // pdf.save("download.pdf");
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "#0B0D27",
          borderRadius: "12px",
          position: "relative",
          mt: 2,
        }}
        py={isMobile ? 5 : 10}
        px={isMobile ? 3 : 10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
      >
        <Typography
          sx={{
            fontSize: isMobile ? "16px" : "24px",
            fontWeight: 600,
            mb: 4,
            alignSelf: "flex-start",
          }}
        >
          {fullName}'s{" "}
          <span>
            {productName == "Certificates"
              ? "Certificate"
              : productName == "Badges"
              ? "Badge"
              : ""}
          </span>
        </Typography>

        {docUrl && (
          <Box ref={ref} position="relative" id="certificate-container">
            <Document
              loading={<LinearProgress />}
              file={{
                url: docUrl,
              }}
              renderMode="svg"
            >
              <Page
                onLoadSuccess={removeTextLayerOffset}
                loading={<LinearProgress />}
                renderTextLayer={false}
                pageNumber={1}
                width={isMobile && !matches ? 315 : matches ? 260 : 600}
              />
            </Document>
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: isMobile ? "0px" : "90px",
            marginTop: "24px",
          }}
        >
          Distributed by:{" "}
          <img src={LogoWhite} style={{ marginLeft: 6 }} alt="" height={16} />
        </Typography>
      </Box>

      <Box
        width="100%"
        display="flex"
        justifyContent={separateButtons ? "space-between" : "center"}
        marginTop="30px"
        sx={{
          flexWrap: isMobile ? "" : "Wrap",
        }}
      >
        <Button
          sx={{
            height: "48px",
            border: "1px solid #fff",
            color: "#fff",
            px: 14,
            mb: 4,
            mr: 16,

            "@media screen and (max-width:768px)": {
              px: 6,
            },
            "&:hover": {
              border: "none",
            },
          }}
          onClick={handleBack}
        >
          {backText || "Back"}
        </Button>
        <Button
          variant="contained"
          sx={{
            //  width: "200px",
            height: "48px",
            px: 14,
            mb: 4,
            "@media screen and (max-width:768px)": {
              px: 6,
            },
          }}
          onClick={(e) => {
            let alink = document.createElement("a");
            if (docUrl) {
              alink.href = docUrl;
              alink.download = `${fullName.replace(/\s/g, "-")}.pdf`;
              alink.click();
            }
          }}
        >
          Download PDF
        </Button>
      </Box>
    </>
  );
};

export default PreviewCertV2;
