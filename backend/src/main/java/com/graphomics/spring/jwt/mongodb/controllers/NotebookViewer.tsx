// NotebookViewer.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const NotebookViewer: React.FC = () => {
  const [notebooks, setNotebooks] = useState<string[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/notebooks")
      .then((response) => setNotebooks(response.data))
      .catch((error) => console.error("Error fetching notebooks", error));
  }, []);

  const handleNotebookChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const notebook = e.target.value;
    setSelectedNotebook(notebook);

    if (notebook) {
      axios
        .get(`http://localhost:8080/convert/${notebook}`)
        .then((response) => setHtmlContent(response.data))
        .catch((error) => console.error("Error converting notebook", error));
    }
  };

  return (
    <div>
      <select onChange={handleNotebookChange} value={selectedNotebook}>
        <option value="">Select a Notebook</option>
        {notebooks.map((notebook, index) => (
          <option key={index} value={notebook}>
            {notebook}
          </option>
        ))}
      </select>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default NotebookViewer;
