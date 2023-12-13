import React, { useState, useEffect } from "react";
import axios from "axios";
import MonacoEditor from "react-monaco-editor"; // For code cells
import "./NotebookEditor.css"; // Importing the CSS file

const NotebookEditor = () => {
  const [notebook, setNotebook] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getipynb/sample.ipynb")
      .then((response) => setNotebook(response.data))
      .catch((error) => console.error("Error fetching notebook", error));
  }, []);

  const handleCellChange = (index, newContent) => {
    const updatedNotebook = { ...notebook };
    updatedNotebook.cells[index].source = newContent.split("\n");
    setNotebook(updatedNotebook);
  };

  if (!notebook) return <div className="loading">Loading...</div>;

  return (
    <div className="notebook-container">
      {notebook.cells.map((cell, index) => (
        <div key={index} className={`cell ${cell.cell_type}`}>
          {cell.cell_type === "code" ? (
            <MonacoEditor
              language="python"
              value={cell.source.join("\n")}
              onChange={(newContent) => handleCellChange(index, newContent)}
            />
          ) : (
            <textarea
              value={cell.source.join("\n")}
              onChange={(e) => handleCellChange(index, e.target.value)}
            />
          )}
        </div>
      ))}
      <button className="save-button" onClick={() => console.log(notebook)}>
        Save Notebook
      </button>
    </div>
  );
};

export default NotebookEditor;
