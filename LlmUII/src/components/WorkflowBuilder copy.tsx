import React, { useState } from "react";
import "./WorkflowBuilder.css"; // You can style your component with CSS
import authHeader from "../services/auth-header";
import axios from "axios";

interface Node {
  id: number;
  type: string;
  config: any; // Node configuration
  name: string; // Node name
}

const WorkflowBuilder: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]); // To store the nodes in the middle area
  const [selectedNode, setSelectedNode] = useState<Node | null>(null); // To store the currently selected node for configuration
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [workflowName, setWorkflowName] = useState<string>(""); // To store the workflow name

  // Separate states for CSV and Scripting node upload methods and uploaded file data
  const [csvUpload, setCsvUpload] = useState<boolean>(false);
  const [scriptUpload, setScriptUpload] = useState<boolean>(false);
  const [nodeFiles, setNodeFiles] = useState<Record<number, File | null>>({});
  const [lastNodeId, setLastNodeId] = useState<number>(0); // new state

  // State to store uploaded CSV file
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // State to store uploaded script file
  const [scriptFile, setScriptFile] = useState<File | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("nodeType");
    const newNodeId = lastNodeId + 1;
    // Create a new node based on the dropped type
    const newNode: Node = {
      id: newNodeId, // Use the length of nodes array as ID to maintain order
      type: nodeType,
      config: {}, // Node configuration
      name: nodeType, // Node name matches the type
    };
    setLastNodeId(newNodeId);
    // Add the new node to the nodes array
    setNodes([...nodes, newNode]);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleEditConfig = (nodeId: number) => {
    // Find the node with the given ID
    const nodeToEdit = nodes.find((node) => node.id === nodeId);
    setSelectedNode(nodeToEdit || null);
  };

  const handleSaveConfig = (updatedConfig: any) => {
    if (!selectedNode) return;
    const updatedNodes = nodes.map((node) =>
      node.id === selectedNode.id ? { ...node, config: updatedConfig } : node
    );
    setNodes(updatedNodes);
    setSelectedNode({ ...selectedNode, config: updatedConfig });
  };

  const handleDeleteNode = (nodeId: number) => {
    // Remove the node with the given ID from the nodes array
    const updatedNodes = nodes.filter((node) => node.id !== nodeId);
    setNodes(updatedNodes);
  };

  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, name: event.target.value }
          : node
      );
      setNodes(updatedNodes);
      setSelectedNode({ ...selectedNode, name: event.target.value });
    }
  };

  const handleSaveWorkflow = async () => {
    const formData = new FormData();
    const workflowData = {
      workflowName,
      nodes: nodes.map((node) => ({
        type: node.type,
        config: node.config,
        name: node.name,
      })),
    };
    formData.append("workflowData", JSON.stringify(workflowData));

    // Separate logic to append files
    nodes.forEach((node) => {
      const file = nodeFiles[node.id];
      if (file) {
        // This check ensures that the file is not null
        formData.append(`file_${node.id}`, file);
      }
    });
    const headers = {
      "Content-Type": "application/json",
    };
    const mergedHeaders = { ...headers, ...authHeader() };
    const response = await axios.post(
      "http://localhost:8080/api/saveWorkflow",
      formData,
      { headers: mergedHeaders }
    );

    if (response.status === 200) {
      setSaveMessage("Save successful!");
      // Optionally, you can hide the message after a few seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      setNodes([]);
      setSelectedNode(null);
      setWorkflowName("");
      setNodeFiles({});
      setLastNodeId(0);
    } else {
      setSaveMessage("Error saving the workflow.");
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };

  const handleSaveWorkflowbk = () => {
    const formData = new FormData(); // Create a JSON object containing the workflow name and nodes with configurations
    const workflowData = {
      workflowName,
      nodes: nodes.map((node) => ({
        type: node.type,
        config: node.config,
        name: node.name,
        file: nodeFiles[node.id],
      })),
    };
    formData.append("workflowData", JSON.stringify(workflowData));

    // Call your API here to save the workflow data
    // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
    const headers = {
      "Content-Type": "application/json",
    };
    const mergedHeaders = { ...headers, ...authHeader() };
    // Make a POST request using Axios
    axios
      .post("http://localhost:8080/api/saveWorkflows", formData, {
        headers: mergedHeaders,
      }) // Specify the URL and headers
      .then((response) => {
        // Handle the API response as needed
      })
      .catch((error) => {
        // Handle errors here
      });
  };

  return (
    <div className="workflow-builder">
      <div className="workflow-header">
        <div className="workflow-header-row">
          <h1>Workflow: {workflowName}</h1>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter Workflow Name"
          />
          <button onClick={handleSaveWorkflow}>Save Workflow</button>
        </div>
      </div>
      <div className="workflow-content">
        <div className="workflow-sidebar">
          <div
            className="workflow-node"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("nodeType", "CSVUpload");
            }}
          >
            CSV Upload
          </div>
          <div
            className="workflow-node"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("nodeType", "PushToNeo4j");
            }}
          >
            Push to Neo4j
          </div>
          <div
            className="workflow-node"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("nodeType", "ScriptingNode");
            }}
          >
            Scripting Node
          </div>
        </div>
        <div
          className={`workflow-canvas ${isDraggingOver ? "dragging-over" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          {/* Render the nodes in the middle area */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`workflow-node ${
                selectedNode === node ? "selected" : ""
              }`}
              onClick={() => handleEditConfig(node.id)}
            >
              {node.name}
              <button onClick={() => handleDeleteNode(node.id)}>Delete</button>
            </div>
          ))}
        </div>
        {/* {selectedNode && (
          <div className="node-configuration">
            <h3>Node Configuration</h3>
            <pre>{JSON.stringify(selectedNode.config, null, 2)}</pre>
            <button onClick={() => handleSaveConfig({})}>Save</button>
          </div>
        )} */}
        {selectedNode && selectedNode.type === "CSVUpload" && (
          <div className="csv-upload-config">
            <h3>CSV Upload Configuration</h3>
            <label>
              <input
                type="radio"
                name="csvUploadOption"
                value="upload"
                checked={selectedNode.config.isUrl}
                onChange={() =>
                  handleSaveConfig({ ...selectedNode.config, isUrl: true })
                }
              />
              Download CSV Through URL
            </label>
            <label>
              <input
                type="radio"
                name="csvUploadOption"
                value="url"
                checked={!selectedNode.config.isUrl}
                onChange={() =>
                  handleSaveConfig({ ...selectedNode.config, isUrl: false })
                }
              />
              Upload CSV File
            </label>
            {selectedNode.config.isUrl && (
              <div>
                <input
                  type="text"
                  placeholder="Enter CSV URL"
                  value={selectedNode.config.url || ""}
                  onChange={(e) =>
                    handleSaveConfig({
                      ...selectedNode.config,
                      url: e.target.value,
                    })
                  }
                />
              </div>
            )}
            {!selectedNode.config.isUrl && (
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const updatedFiles = {
                        ...nodeFiles,
                        [selectedNode.id]: e.target.files[0],
                      };
                      setNodeFiles(updatedFiles);
                    }
                  }}
                />
              </div>
            )}
            <div>
              Delimiter:
              <input
                type="text"
                value={selectedNode.config.delimiter || ","}
                onChange={(e) =>
                  handleSaveConfig({
                    ...selectedNode.config,
                    delimiter: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
        {selectedNode && selectedNode.type === "ScriptingNode" && (
          <div className="scripting-node-config">
            <h3>Scripting Node Configuration</h3>
            <label>
              <input
                type="radio"
                name="scriptOption"
                value="upload"
                checked={selectedNode.config.isUpload}
                onChange={() =>
                  handleSaveConfig({ ...selectedNode.config, isUpload: true })
                }
              />
              Upload Script File
            </label>
            {selectedNode.config.isUpload && (
              <div>
                <input
                  type="file"
                  accept=".js,.py" // accept JavaScript and Python files; adjust this to your needs
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const updatedFiles = {
                        ...nodeFiles,
                        [selectedNode.id]: e.target.files[0],
                      };
                      setNodeFiles(updatedFiles);
                    }
                  }}
                />
              </div>
            )}
            <label>
              <input
                type="radio"
                name="scriptOption"
                value="type"
                checked={!selectedNode.config.isUpload}
                onChange={() =>
                  handleSaveConfig({ ...selectedNode.config, isUpload: false })
                }
              />
              Type Script
            </label>

            {!selectedNode.config.isUpload && (
              <div>
                <textarea
                  value={selectedNode.config.script || ""}
                  placeholder="Enter script"
                  onChange={(e) =>
                    handleSaveConfig({
                      ...selectedNode.config,
                      script: e.target.value,
                    })
                  }
                  rows={6}
                />
              </div>
            )}
          </div>
        )}

        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
