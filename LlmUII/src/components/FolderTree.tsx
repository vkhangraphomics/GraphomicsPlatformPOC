import React, { useState, useEffect } from "react";
import axios from "axios";

const FolderTree = () => {
  const [folderData, setFolderData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/folders")
      .then((response) => {
        console.log(response.data);
        setFolderData(response.data);
      })
      .catch((error) => console.error("Error fetching folder data", error));
  }, []);

  return (
    <div>
      {folderData ? <FolderItem item={folderData} /> : <div>Loading...</div>}
    </div>
  );
};
const FolderItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === "folder";

  return (
    <div>
      <div onClick={() => isFolder && setIsOpen(!isOpen)}>
        {isFolder ? (isOpen ? "📂" : "📁") : "📄"} {item.name}
      </div>
      {isFolder && isOpen && item.children && (
        <div style={{ marginLeft: "20px" }}>
          {item.children.map((child, index) => (
            <FolderItem key={index} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTree;
