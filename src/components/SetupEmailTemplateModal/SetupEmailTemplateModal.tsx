import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useOutletContext } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

export interface ISetEmailModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  onResend: () => void;
  isMobile: boolean;
  loading?: boolean;
}

const schema = Yup.object({
  senderName: Yup.string().required("Sender's Name field is required"),
  orgName: Yup.string().required("Organisation Name field is required"),
  // body: Yup.string().required("Description field is required"),
}).required();

export default function SetupEmailTemplateModal({
  open,
  onClose,
  onConfirm,
  onResend,
  isMobile,
  loading,
}: ISetEmailModalProps) {
  const theme = useTheme();
  const context: any = useOutletContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const onSubmit = (data: any) => {
    context?.setUploaded((prev: any) => ({
      ...prev,
      orgName: data?.orgName,
      description: data?.body ? data?.body : "",
      senderName: data?.senderName,
    }));
    onConfirm({ ...data });
  };
  console.log("err", errors);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="provide-email"
      aria-describedby="provide-email-you-want-recepient-to-respond-to"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          minWidth: "33ch",
          px: {
            xs: theme.spacing(1),
            md: theme.spacing(8),
          },
          py: (theme) => theme.spacing(8),
          textAlign: "center",
        },
      }}
    >
      <DialogContent>
        <Box component="form" width="100%">
          <Stack spacing={12}>
            <Box>
              <Typography variant="subtitle1">Set Up Email Template</Typography>
            </Box>

            <Box>
              <Box
                mb={8}
                display="flex"
                alignItems="center"
                flexDirection={{ xs: "column", md: "row" }}
                width="100%"
              >
                <Box width="100%" mb={{ xs: 8, md: 0, textAlign: "start" }}>
                  <InputLabel required>Name of Sender</InputLabel>
                  <Controller
                    name="senderName"
                    control={control}
                    render={({ field }: any) => (
                      <TextField
                        {...field}
                        error={errors?.email?.message}
                        fullWidth
                        size="small"
                        placeholder="John Doe"
                        InputLabelProps={{ shrink: true }}
                        helperText={errors?.email?.message}
                      />
                    )}
                  />
                </Box>
                <Box width="100%" ml={{ xs: 0, md: 4, textAlign: "start" }}>
                  <InputLabel required>Name of Organisation</InputLabel>
                  <Controller
                    name="orgName"
                    control={control}
                    render={({ field }: any) => (
                      <TextField
                        {...field}
                        placeholder="Microsoft"
                        error={errors?.email?.message}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        helperText={errors?.email?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box width="100%" sx={{ textAlign: "start" }}>
                <InputLabel>Email Write up to Receipients</InputLabel>
                <Controller
                  name="body"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      error={errors?.email?.message}
                      multiline
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      helperText={errors?.email?.message}
                      rows={8}
                      placeholder="Description"
                    />
                  )}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={4} width="100%" mt={12}>
          <Button
            variant="outlined"
            size={isMobile ? "small" : "large"}
            onClick={onResend}
            fullWidth
          >
            Use Default Info
          </Button>
          <Button
            variant="contained"
            size={isMobile ? "small" : "large"}
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
