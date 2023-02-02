import { Box, IconButton, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import PreUpload from "./components/PreUpload";
import closeIcon from "assets/close.svg";

export interface IDropzoneProps {
  theme: Theme;
  onUpload: (data: File) => void;
  onDrop?: () => void;
  open?: () => void;
  accept: Accept;
  title: string;
}

const Dropzone = ({
  theme,
  onDrop,
  accept,
  open,
  onUpload,
  title,
}: IDropzoneProps) => {
  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept,
    onDrop,
    disabled,
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      setDisabled(true);
      setFile(acceptedFiles[0]);
    } else {
      setDisabled(false);
      setFile(null);
    }
  }, [JSON.stringify(acceptedFiles)]);

  const removeFile = () => {
    if (file) {
      // @ts-ignore
      acceptedFiles.splice(file, 1);
      setDisabled(false);
      setFile(null);
    }
  };

  return (
    <Box
      {...getRootProps({ className: "dropzone long-dashed-border" })}
      sx={{
        position: "relative",
      }}
      p={16}
    >
      <input className="input-zone" {...getInputProps()} />
      {file?.name && (
        <IconButton
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: "20px",
            right: "10px",
            background: theme.palette.action.disabledBackground,
          }}
          onClick={removeFile}
        >
          <img src={closeIcon} alt="close" />
        </IconButton>
      )}
      <PreUpload
        theme={theme}
        onUploadClick={(data?: string) => {
          console.log("drop", data);
          data ? onUpload(acceptedFiles[0]) : open && open!();
        }}
        fileName={file?.name || ""}
        title={title}
      />
    </Box>
  );
};

export default Dropzone;
