import { Box, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SharedStepper from "components/SharedStepper/SharedStepper";
import TabButtons from "components/TabButtons/TabButtons";
import LogoWhite from "assets/logo-white.svg";
import React, { FC } from "react";
// import * as XLSX from "xlsx";
import Footer from "../Footer";
import { make_cols } from "utils/makCols";
import { read, utils } from "xlsx";

const convertToTableData = (columns: string[], data: any[]) => {
  const rows: any = [];
  data.forEach((rws) => {
    const rowData: any = {};
    rws.forEach((row: any, idx: number) => {
      rowData[columns[idx]] = row;
    });
    rows.push(rowData);
  });
  return rows;
};

export interface IDocumentLayout {
  steps: { label: string; value: number; path: string }[];
  tabItems: { id: number; name: string }[];
}

const DocumentLayout: FC<IDocumentLayout> = ({ steps, tabItems }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentStep, setCurrentStep] = React.useState(1);
  const [uploaded, setUploaded] = React.useState<{
    doc: File | null;
    list: File | null;
  }>({ doc: null, list: null });

  const readUploadFile = (file: File) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e: any) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data: any = utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      const headerTitles = data[0];
      console.log(data, headerTitles);
      data.splice(0, 1);
      const columnKeys: any[] = [];
      const headers = headerTitles.map((val: string) => {
        columnKeys.push(val.toLowerCase().replaceAll(" ", "_"));
        return {
          title: val,
          field: val.toLowerCase().replaceAll(" ", "_"),
        };
      });
      const body = convertToTableData(columnKeys, data);
      setUploaded((prev) => ({ ...prev, tableData: { headers, body } }));
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Box
      pl={isMobile ? 4 : 10}
      pr={isMobile ? 4 : 10}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      sx={{
        height: isMobile ? "100%" : "100vh",
        pt: theme.spacing(5),
        // pb: theme.spacing(10),
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={12} sm={2.5} sx={{ height: "100%" }}>
          <Stack spacing={8} mt={4.5}>
            <Link to="/">
              <img src={LogoWhite} alt="" width={isMobile ? 126.8 : 180} />
              {/* <img src={LogoWhite} alt="" width="20%" /> */}
            </Link>

            {!isMobile && (
              <SharedStepper
                orientation="vertical"
                steps={steps}
                current={currentStep}
                isMobile={isMobile}
              />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={8.8} sx={{ height: "100%" }}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <TabButtons activeTab={1} isMobile={isMobile} data={tabItems} />
            </Grid>
            {isMobile && (
              <Grid item xs={12}>
                <SharedStepper
                  orientation="horizontal"
                  steps={steps}
                  current={currentStep}
                  isMobile={isMobile}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Outlet
                context={{
                  setCurrentStep,
                  uploaded,
                  setUploaded,
                  readUploadFile,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default DocumentLayout;
