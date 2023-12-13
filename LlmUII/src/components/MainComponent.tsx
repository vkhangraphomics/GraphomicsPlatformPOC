// MainComponent.tsx
import React, { useState } from "react";
import FileUpload from "./FileUpload"; // Assuming FileUpload is in the same directory
import FolderView from "./FolderTree";
import "../styles/MainComponent.css";

const MainComponent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles([...uploadedFiles, ...files]);
    // Process files to display in FolderStructure (to be implemented)
  };

  return (
    <div className="main-container">
      <div className="tabs">
        <button onClick={() => setCurrentTab("upload")}>Upload</button>
        <button onClick={() => setCurrentTab("view")}>View</button>
        <button onClick={() => setCurrentTab("edit")}>Edit</button>
      </div>
      <div className="content">
        {currentTab === "upload" && (
          <FileUpload onFilesAdded={handleFilesAdded} />
        )}
        {currentTab === "view" && (
          <FolderView />
          //   <div>Folder Structure Component (Placeholder)</div>
        )}
        {currentTab === "edit" && <div>Edit File Component (Placeholder)</div>}
      </div>
    </div>
  );
};

export default MainComponent;
