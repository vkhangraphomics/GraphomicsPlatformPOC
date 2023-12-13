import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import authHeader from "../services/auth-header";
import "./WorkflowList.css";
const WorkflowList: React.FC = () => {
  const [workflowNames, setWorkflowNames] = useState<string[]>([]);
  const [workflowStatuses, setWorkflowStatuses] = useState<
    Record<string, string>
  >({}); // To track the status of each workflow

  const [workflowLogs, setWorkflowLogs] = useState<Record<string, string>>({});

  useEffect(() => {
    getWorkflows();
    refreshWorkflows();
  }, []);

  const getWorkflows = () => {
    // Fetch workflow names and statuses from MongoDB
    axios
      .get("/api/getWorkflows", { headers: authHeader() }) // Replace with your API endpoint
      .then((response) => {
        setWorkflowNames(response.data);
        // Update the statuses from the backend response if provided
        // Otherwise, you can initialize them to a default status here
        // setWorkflowStatuses(/* fetch statuses from response.data */);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workflow names:", error);
      });
  };

  const refreshWorkflows = () => {
    axios
      .get("/api/getAudit", { headers: authHeader() })
      .then((response) => {
        const updatedStatuses: Record<string, string> = { ...workflowStatuses }; // Preserve the current statuses
        const updatedLogs: Record<string, string> = { ...workflowLogs }; // Preserve the current logs

        response.data.forEach((item: any) => {
          if (workflowNames.includes(item.workflowName)) {
            updatedStatuses[item.workflowName] = item.status;
            updatedLogs[item.workflowName] = item.logs;
          }
        });

        setWorkflowStatuses(updatedStatuses);
        setWorkflowLogs(updatedLogs);
      })
      .catch((error) => {
        console.error("Error fetching workflow data:", error);
      });
  };

  function downloadLogs(logContent: string) {
    const blob = new Blob([logContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "workflowLog.txt";
    link.click();
  }
  function executeWorkflow(workflowName: string) {
    // Update the status of the workflow to "In Progress"
    setWorkflowStatuses((prevStatuses) => ({
      ...prevStatuses,
      [workflowName]: "In Progress",
    }));

    axios
      .post(`/api/executeWorkflow/${workflowName}`, null, {
        headers: authHeader(),
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error executing workflow:", error);
      });
    console.log(`Executing workflow: ${workflowName}`);
  }

  return (
    <div className="appBackground">
      <h2>Saved Workflows</h2>
      <Button variant="contained" color="secondary" onClick={refreshWorkflows}>
        Refresh
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workflow Name</TableCell>
              <TableCell>Logs</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflowNames.map((workflowName) => (
              <TableRow key={workflowName}>
                <TableCell>{workflowName}</TableCell>
                <TableCell>
                  {workflowLogs[workflowName] && (
                    <Button
                      onClick={() => downloadLogs(workflowLogs[workflowName])}
                    >
                      Logs
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {workflowStatuses[workflowName] || "Default Status"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => executeWorkflow(workflowName)}
                  >
                    {workflowStatuses[workflowName] === "In Progress"
                      ? "In Progress"
                      : "Execute"}
                  </Button>
                  {/* Add any other actions you need */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WorkflowList;
