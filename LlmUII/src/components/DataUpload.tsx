import React, { useState } from "react";
import axios from "axios"; // Import the axios library
import "../styles/All.css";
import authHeader from "../services/auth-header";

const DragDropFileUpload: React.FC = () => {
  const [inputDataFile, setInputDataFile] = useState<File | null>(null);
  const [scriptsFile, setScriptsFile] = useState<File | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (inputDataFile) {
      formData.append("inputData", inputDataFile);
    }

    if (scriptsFile) {
      formData.append("script", scriptsFile);
    }

    try {
      // Assuming your backend endpoint for uploading is `/upload-files`
      const response = await axios.post("http://localhost:8080/api/upload-files", formData,{headers: authHeader(),});
      console.log("Upload response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-section">
        <label className="file-upload-label">Upload Input Data</label>
        <div className="drag-drop-zone">
          <input
            type="file"
            className="file-input"
            onChange={(e) => handleFileChange(e, setInputDataFile)}
          />
          <p>Drag & Drop or Click to Upload</p>
        </div>
        {inputDataFile && <p>Selected File: {inputDataFile.name}</p>}
      </div>

      <div className="file-upload-section">
        <label className="file-upload-label">Upload Scripts</label>
        <div className="drag-drop-zone">
          <input
            type="file"
            className="file-input"
            onChange={(e) => handleFileChange(e, setScriptsFile)}
          />
          <p>Drag & Drop or Click to Upload</p>
        </div>
        {scriptsFile && <p>Selected File: {scriptsFile.name}</p>}
      </div>

      {/* Adding a submit button to handle the file uploads */}
      <button onClick={handleSubmit} className="submit-btn">
        Upload Files
      </button>
    </div>
  );
};

export default DragDropFileUpload;
