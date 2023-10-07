import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  styled,
  Typography,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close } from "@mui/icons-material";

interface ModalProps {
  content: any;
  open: boolean;
  onClose?: () => void;
  onButtnLeftActn: () => void;
  title: any;
  okBtnText: string;
  okBtnAction: () => void;
  okBtnProps?: any;
  buttonLeft?: string;
  loading?: boolean;
  showbtn?: boolean;
}

export default function Modal({
  content,
  open,
  onClose,
  onButtnLeftActn,
  title,
  okBtnText,
  okBtnAction,
  okBtnProps,
  buttonLeft,
  loading,
  showbtn,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#101549",
          py: 10,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
        }}
      >
        {/* {onClose && (
          <IconButton aria-label="close" onClick={onClose} size="large">
            <Close />
          </IconButton>
        )} */}
      </DialogTitle>
      <DialogContent sx={{ pb: 0, overflowY: "unset", textAlign: "center" }}>
        <Typography variant="h5">{title}</Typography>
        <Box
          mb={9}
          sx={{
            mt: 1,

            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box width="80%">
            <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
              {" "}
              {content}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      {!showbtn && (
        <Box sx={{ pb: 8, display: "flex", justifyContent: "center" }}>
          <Button
            // color="secondary"
            onClick={onButtnLeftActn}
            variant="outlined"
            sx={{ mx: 6, p: "12px 38px" }}
          >
            {buttonLeft || "Cancel"}
          </Button>
          <Button
            // color="secondary"
            type="submit"
            var
            variant="contained"
            onClick={okBtnAction}
            {...okBtnProps}
            loading={loading}
            sx={{ p: "12px 38px" }}
          >
            {okBtnText}
          </Button>
        </Box>
      )}
    </Dialog>
  );
}
