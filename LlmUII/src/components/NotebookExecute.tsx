import React, { useState, useEffect } from "react";
import axios from "axios";

const NotebookExecute: React.FC = () => {
  const [notebooks, setNotebooks] = useState<string[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<string>("");
  const [executionStatus, setExecutionStatus] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notebooks")
      .then((response) => setNotebooks(response.data))
      .catch((error) => {
        console.error("Error fetching notebooks", error);
        setExecutionStatus("Failed to fetch notebooks.");
        setAlertType("error");
      });
  }, []);

  const handleNotebookExecution = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const notebook = e.target.value;
    setSelectedNotebook(notebook);
    setExecutionStatus("");
    setAlertType("");

    if (notebook) {
      setExecutionStatus("Notebook execution in progress...");
      setAlertType("success");
      axios
        .post(`http://localhost:8080/api/executenb/${notebook}`)
        .then(() => {
          setExecutionStatus(
            "Execution completed. You can view the notebook in the view section."
          );
          setAlertType("success");
        })
        .catch((error) => {
          console.error("Error executing notebook", error);
          setExecutionStatus("Error occurred during notebook execution.");
          setAlertType("error");
        });
    }
  };

  const renderAlert = () => {
    if (!executionStatus) return null;

    const alertClass = alertType === "error" ? "alert-error" : "alert-success";
    return <div className={`alert ${alertClass}`}>{executionStatus}</div>;
  };

  return (
    <div>
      <select onChange={handleNotebookExecution} value={selectedNotebook}>
        <option value="">Select a Notebook to Execute</option>
        {notebooks.map((notebook, index) => (
          <option key={index} value={notebook}>
            {notebook}
          </option>
        ))}
      </select>
      {renderAlert()}
    </div>
  );
};

export default NotebookExecute;
