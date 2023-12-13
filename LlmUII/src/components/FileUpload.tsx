// FileUpload.tsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../styles/FileUpload.css";

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });

      axios
        .post("http://localhost:8080/api/setupUpload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("File successfully uploaded", response.data);
          onFilesAdded(acceptedFiles);
        })
        .catch((error) => {
          console.error("Error uploading file", error);
        });
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default FileUpload;
