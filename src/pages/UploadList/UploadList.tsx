import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { saveAs } from "file-saver";
import Dropzone from "components/Dropzone/Dropzone";
import { useNavigate, useOutletContext } from "react-router-dom";
import Spreadsheet from "assets/Spreadsheet.svg";
import React from "react";
import {
  EXCEL_TEMPLATE_DATA,
  EXCEL_TEMPLATE_DATA_NAME_ONLY,
} from "constants/appConstants";
import { utils, write } from "xlsx";
import { getPathByName } from "utils/getPathsByName";
import Modal from "shared/Layout/Modal";

const excelFileHeader = ["Recipient Full Name", "Recipient Email Address"];
const excelFileHeaderNameOnly = ["Recipient Full Name"];

const UploadList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [listType, setListType] = useState("");
  const [openModal, setOpenModal] = React.useState<boolean>(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context: any = useOutletContext();
  const [isFile, setIsFile] = useState<any>(false);
  const imgStyle = {
    width: "100%",
  };

  const handleUpload = (data: File) => {
    if (listType === "email") {
      context?.readUploadFile(data, excelFileHeader, () => {
        navigate(getPathByName(context.activeTab, 3));
      });
      context?.setUploaded((prev: any) => ({
        ...prev,
        listType,
      }));
    } else {
      context?.readUploadFile(data, excelFileHeaderNameOnly, () => {
        navigate(getPathByName(context.activeTab, 3));
      });
      context?.setUploaded((prev: any) => ({
        ...prev,
        listType,
      }));
    }
  };

  React.useEffect(() => {
    context?.setCurrentStep(2);
  }, []);

  const exportAsExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
    const ext = ".xlsx";
    const ws = utils.json_to_sheet(EXCEL_TEMPLATE_DATA);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `recipients-template${ext}`);
  };
  const exportAsExcelNameOnly = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
    const ext = ".xlsx";
    const ws = utils.json_to_sheet(EXCEL_TEMPLATE_DATA_NAME_ONLY);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `recipients-template${ext}`);
  };
  const buttonLeftAtn = () => {
    setListType("none");
    setOpenModal(false);
  };
  return (
    <Stack spacing={12}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        {!isFile && (
          <>
            <Box sx={{ my: "10px" }}>
              {" "}
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Create and upload a list of the recipients in a spreadsheet
                using this format below.
              </Typography>{" "}
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "#8F9099",
                  display: isMobile ? "none" : "block",
                }}
              >
                Click the list image below to download the template, paste the
                list of names into it & upload.
              </Typography>{" "}
            </Box>
            <img
              title="Click to download template"
              src={Spreadsheet}
              style={isMobile ? imgStyle : { cursor: "pointer" }}
              onClick={() =>
                listType === "email" ? exportAsExcel() : exportAsExcelNameOnly()
              }
            />
          </>
        )}
      </Box>
      <Dropzone
        accept={{
          ".csv": [],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".csv",
          ],
          "application/vnd.ms-excel": [],
        }}
        onUpload={handleUpload}
        theme={theme}
        title="CSV, Xls, Xlsx are supported"
      />
      <Box display="flex" justifyContent="flex-end" marginTop={"30px"}>
        <Button
          variant="contained"
          sx={{
            height: "48px",
            px: 14,
            mb: 6,
            "@media screen and (max-width:768px)": {
              px: 8,
            },
          }}
          onClick={() => {
            navigate(getPathByName(context.activeTab, 1));
          }}
        >
          Back
        </Button>
        <Modal
          open={openModal}
          title="Upload List"
          content="Do you want to upload only recipients’ name or both recipients’ name and email?
If you upload only the names you won’t be able to send the certificates to their email but you can download the certificates."
          onButtnLeftActn={buttonLeftAtn}
          okBtnText="Name & Email"
          buttonLeft="Name Only"
          okBtnAction={() => {
            setListType("email");
            setOpenModal(false);
          }}
        />
      </Box>
    </Stack>
  );
};

export default UploadList;
