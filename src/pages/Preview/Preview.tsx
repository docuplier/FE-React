import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { saveAs } from "file-saver";
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
import { getLongestName } from "utils/getLongestName";
import {
  completeProcess,
  signupEmail,
  verifyOTP,
  resendOTP,
} from "services/documents";
import { utils, write } from "xlsx";

import PreviewExcelTable from "./PreviewExcelTable";
import PreviewCert from "./PreviewCert";
import { getPathByName } from "utils/getPathsByName";
import ToastContent from "components/ToastContent/ToastContent";

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
  const [emailId, setEmailId] = useState();
  const [showPreview, setShowPreview] = useState(false);
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
      const errData: any = error.response?.data;
      if (errData?.message) {
        toast.error(
          <ToastContent
            toastType="error"
            message={
              errData.message || "Unable to create user. Please try again"
            }
          />
        );
      }
    },
    onSuccess: (resp: any) => {
      toast.success(
        <ToastContent
          toastType="success"
          message={
            resp?.message || `An OTP has been sent to ${resp.data.email}`
          }
        />
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
        step: 3,
      }));
    },
  });

  const { mutate: verifyOtp, isLoading: verifyingOtp } = useMutation(
    verifyOTP,
    {
      onError: (error: AxiosError) => {
        const errData: any = error.response?.data;
        if (errData?.message) {
          toast.error(
            <ToastContent
              toastType="error"
              message={
                errData.message ||
                "Something went wrong while trying to send request"
              }
            />
          );
        }
        setModalControl((prev) => ({
          ...prev,
          otpError: true,
        }));
      },
      onSuccess: (resp: any) => {
        toast.success(
          <ToastContent
            toastType="success"
            message={
              resp?.message || `An OTP has been sent to ${resp.data.email}`
            }
          />
        );
        setModalControl((prev) => ({
          ...prev,
          openOtp: false,
          step: ++prev.step,
        }));
      },
    }
  );
  const { mutate: resendOtp } = useMutation(resendOTP, {
    onError: (error: AxiosError) => {
      toast.error(
        <ToastContent
          toastType="error"
          message={error?.message || "Unable to get data from server"}
        />
      );
    },
    onSuccess: (resp: any) => {
      toast.success(
        <ToastContent
          toastType="success"
          message={
            resp?.message || `An OTP has been re-sent to ${resp.data.email}`
          }
        />
      );
      setModalControl((prev) => ({
        ...prev,
        openEmailSetup: false,
        setupEmailPayload: {
          email: resp?.data?.email,
          name: resp?.data?.name,
        },
        step: 3,
      }));
    },
  });

  const { mutate: saveData, isLoading: completingProcess } = useMutation(
    completeProcess,
    {
      onError: (error: AxiosError) => {
        toast.error(
          <ToastContent
            toastType="error"
            message={
              error?.message ||
              "Something went wrong while trying to send request"
            }
          />
        );
      },
      onSuccess: (resp: any) => {
        toast.success(
          <ToastContent
            toastType="success"
            message={resp?.message || `Success: Data saved!`}
          />
        );
        return navigate(getPathByName(context.activeTab, 4));
      },
    }
  );
  const rgbValues = context?.uploaded?.colorChange?.match(/\d+/g);

  React.useEffect(() => {
    context?.setCurrentStep(3);
    //  parseFile(context)
    if (!context?.uploaded?.tableData) {
      navigate("/");
    }
  }, []);
  const handleContinue = () => {
    if (modalControl.step === 3)
      return setModalControl((prev) => ({
        ...prev,
        openOtp: true,
      }));

    if (modalControl.step === 2)
      return setModalControl((prev) => ({
        ...prev,
        openEmailSetup: true,
      }));

    if (modalControl.step > 3) {
      const uploaded = context?.uploaded;

      const product = context?.products && context?.products[0];
      const image = context?.uploaded;
      const formData = new FormData();
      formData.append("idempotencyKey", uploaded?.idempotencyKey);
      formData.append("orgName", uploaded?.orgName);
      if (uploaded?.description !== undefined) {
        formData.append("description", uploaded?.description);
      } else {
        formData.append("description", " ");
      }
      formData.append("notificationMode", uploaded?.listType);

      formData.append("docImage", image?.image?.src, image?.dataFile?.name);
      formData.append(
        "image",
        JSON.stringify({
          width: context?.uploaded?.docnaturalValue?.width,
          height: context?.uploaded?.docnaturalValue?.height,
          renderedWidth: context?.uploaded?.renderedAspectRatio?.width,
          renderedHeight: context?.uploaded?.renderedAspectRatio?.height,
        })
      );

      formData.append("product", context?.productId);
      formData.append("owner", owner?._id);
      formData.append("emailText", uploaded?.description);
      const rgbValues = uploaded?.colorChange?.match(/\d+/g);

      const field = {
        fields: [
          {
            fieldName: "name",
            fontFamily: uploaded?.selectedFont,
            fontSize: uploaded?.selectedFontSize,
            fontStyle: uploaded?.selectedFontStyle,
            fontCapitalization: uploaded?.selectedFontCase,
            fontColour: {
              red: rgbValues[0],
              green: rgbValues[1],
              blue: rgbValues[2],
            },
            width: (60 / 100) * context?.uploaded?.renderedAspectRatio?.width,
            height: 30.25,
            top: uploaded?.dimension?.top,
            bottom: uploaded?.dimension?.bottom,
            left: uploaded?.dimension?.left,
            right: uploaded?.dimension?.right,
            x: uploaded?.dimension?.x,
            y: uploaded?.dimension?.y,
            // color: "rgb(0,0,0)",
          },
        ],
      };

      formData.append(
        "fields",
        JSON.stringify(
          field?.fields?.map(
            (v: {
              fieldName: string;
              fontFamily: string;
              fontSize: number;
              fontStyle: string;
              fontCapitalization: string;
              fontColour: object;
              width: number;
              height: number;
              top: number;
              bottom: number;
              left: number;
              right: number;
              x: number;
              y: number;
              // color: string;
            }) => ({
              fieldName: v.fieldName,
              fontFamily: v.fontFamily,
              fontSize: v.fontSize,
              fontStyle: v.fontStyle,
              fontCapitalization: v.fontCapitalization,
              fontColour: v.fontColour,
              width: v.width,
              height: v.height,
              top: v.top,
              bottom: v.bottom,
              left: v.left,
              right: v.right,
              x: v.x,
              y: v.y,
              // color: v.color,
            })
          )
        )
      );

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
  const exportAsExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
    const ext = ".xlsx";
    const objKeys = Object.keys(context?.uploaded?.tableData?.body[0]);

    const body = context?.uploaded?.tableData?.body.map((v: any) => {
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

  const fontNumber = (context?.uploaded?.renderedAspectRatio?.width / 100) * 60;

  return (
    <Stack spacing={12}>
      {showPreview ? (
        <PreviewCert
          fullName={getLongestName(
            context?.uploaded?.tableData?.body.map(
              (v: any) => v.recipient_full_name
            )
          )}
          hideDownloadbtn={false}
          doc={context?.uploaded?.doc}
          isMobile={isMobile}
          selectedFont={context?.uploaded?.selectedFont}
          selectedFontStyle={context?.uploaded?.selectedFontStyle}
          colorChange={context?.uploaded?.colorChange}
          onBackClick={() => setShowPreview(false)}
          imgSize={{
            height: context?.uploaded?.image?.height,
            width: context?.uploaded?.image?.width,
          }}
          selectedFontSize={
            context?.uploaded?.selectedFontSize || (5 / 100) * fontNumber
          }
          selectedFontCase={context?.uploaded?.selectedFontCase}
          dimension={context?.uploaded?.dimension}
          docType={context?.uploaded?.dataFile?.type}
          separateButtons
        />
      ) : (
        <PreviewExcelTable
          tableBody={context?.uploaded?.tableData?.body}
          tableHeaders={context?.uploaded?.tableData?.headers}
          isMobile={isMobile}
          exportAsExcel={exportAsExcel}
          onEmailToRecipient={() =>
            setModalControl((prev) => ({
              ...prev,
              openEmailTemplateSetup: true,
            }))
          }
          disableEmailToRecipient={checkMissingFields(
            context?.uploaded?.tableData?.body,
            context?.uploaded?.listType
          )}
          step={modalControl.step}
          loading={completingProcess}
          onContinue={handleContinue}
          theme={theme}
          onPreviewClick={() => setShowPreview(true)}
        />
      )}

      <SetupEmailModal
        productName={context?.uploaded?.orgName}
        open={modalControl.openEmailSetup}
        onClose={() =>
          setModalControl((prev) => ({
            ...prev,
            openEmailSetup: false,
          }))
        }
        onConfirm={(payload) => mutate(payload)}
        loading={isCreating}
      />
      <OtpModal
        error={modalControl.otpError}
        open={modalControl.openOtp}
        onClose={() => setModalControl((prev) => ({ ...prev, openOtp: false }))}
        onConfirm={(data: any) => verifyOtp({ token: data })}
        loading={verifyingOtp}
        onInputChange={(e: any) =>
          setModalControl((prev) => ({
            ...prev,
            otpError: false,
          }))
        }
        onResend={() => resendOtp({ payload: {}, id: owner?._id })}
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
            toast.success(
              <ToastContent
                toastType="success"
                message="Template Created Successfully"
              />
            );
            setModalControl((prev) => ({
              ...prev,
              openEmailTemplateSetup: false,
              step: 2,
            }));
          }, 2500);
        }}
        onResend={() => {
          setModalControl((prev) => ({
            ...prev,
            openEmailTemplateSetup: false,
            step: 2,
          }));
          toast.success(
            <ToastContent
              toastType="success"
              message="Template has been set to default"
            />
          );
        }}
        isMobile={isMobile}
      />
    </Stack>
  );
};

export default Preview;
