import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import tooltipIcon from "assets/tooltipIcon.svg";

export interface ISetEmailModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  onInputChange: (event: any) => void;
  onResend: () => void;
  hideCaption?: boolean;
  captionText?: string;
  loading?: boolean;
  resending?: boolean;
  error?: boolean;
}

export default function OtpModal({
  open,
  onClose,
  onConfirm,
  onInputChange,
  onResend,
  hideCaption,
  captionText,
  loading,
  resending,
  error,
}: ISetEmailModalProps) {
  const theme = useTheme();
  const [otp, setOtp] = React.useState("");
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [disableResend, setDisableResend] = React.useState(true);
  const descriptionElementRef = React.useRef<HTMLElement>(null);

  const handleResend = () => {
    setTimeout(() => {
      setDisableResend(false);
    }, 30000);
  };

  React.useEffect(() => {
    if (open) {
      handleResend();
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    } else {
      setOtp("");
      // setDisableResend(true);
    }
  }, [open]);

  const onChange = React.useCallback(
    (e: any) => {
      setOtp(e);
      onInputChange(e);
      if (e.length === 4) {
        setDisableSubmit(false);
      } else {
        if (!disableSubmit) {
          setDisableSubmit(true);
        }
      }
    },
    [otp]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="provide-email"
      aria-describedby="provide-email-you-want-recepient-to-respond-to"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          px: {
            xs: theme.spacing(4),
            md: theme.spacing(8),
          },
          py: (theme) => theme.spacing(8),
          textAlign: "center",
        },
      }}
    >
      <DialogContent sx={{ maxWidth: "28ch", margin: "auto" }}>
        <Stack spacing={12}>
          <Box>
            <Typography variant="subtitle1">Enter the OTP</Typography>
          </Box>

          <Box>
            <Typography variant="body2" textAlign="left">
              OTP
            </Typography>
            <MuiOtpInput
              value={otp}
              onChange={onChange}
              TextFieldsProps={{
                size: "small",
                error,
              }}
            />
            {!hideCaption && (
              <Box display="flex" alignItems="center" mt={1}>
                <img src={tooltipIcon} alt="" />
                <Typography variant="caption" ml={2}>
                  {captionText || "Check your email for your OTP"}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={onResend}
            sx={{ mx: 2 }}
            disabled={resending || disableResend}
            startIcon={resending && <CircularProgress size={16} />}
          >
            Resend OTP
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{ mx: 2 }}
            onClick={() => onConfirm(otp)}
            //  fullWidth
            disabled={disableSubmit || loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            Confirm OTP
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
