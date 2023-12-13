import React, { useEffect, useState } from "react";
import "./NodePage.css"; // You can style your component with CSS
import axios from "axios";
import authHeader from "../services/auth-header";
import Modal from "./Modal";
import "./Modal.css";

const WorkflowBuilder: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null); // To store the selected node
  const [nodes, setNodes] = useState<any[]>([]); // To store the nodes
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, any>>({}); // Store the node configurations
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const handleNodeSelect = (nodeType: string) => {
    setSelectedNode({ type: nodeType, config: {} });
    setShowModal(true);
  };

  useEffect(() => {
    axios
      .get("/api/getNodes", { headers: authHeader() }) // Replace with your API endpoint
      .then((response) => {
        setNodeConfigs(response.data);
        // Update the statuses from the backend response if provided
        // Otherwise, you can initialize them to a default status here
        // setWorkflowStatuses(/* fetch statuses from response.data */);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workflow names:", error);
      });
  }, []);
  const addNode = (node: any) => {
    if (node.order > nodes.length) {
      setNodes([...nodes, node]);
    } else {
      setNodes(nodes.map((n) => (n.order === node.order ? node : n)));
    }
  };

  const handleInputChange = (name: string, value: string | number) => {
    if (selectedNode) {
      if (name === "order") {
        value = parseInt(value as string);
      }
      setSelectedNode({
        ...selectedNode,
        config: { ...selectedNode.config, [name]: value },
        ...(name === "order" && { order: value }),
      });
    }
  };

  const renderNodeUI = () => {
    console.log(selectedNode);
    console.log(nodeConfigs);
    if (selectedNode && nodeConfigs[selectedNode.type]) {
      const selectedNodeConfig = nodeConfigs[selectedNode.type];

      return (
        <div className="selected-node">
          <h3>{selectedNodeConfig.label}</h3>
          {selectedNodeConfig.fields.map((field: any) => (
            <div key={field.name}>
              <label>{field.label}</label>
              {field.inputType === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                ></textarea>
              ) : (
                <input
                  type={field.inputType}
                  accept={field.accept}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
          {/* Add a button to save the configuration */}
          <button onClick={handleSaveConfig}>Save Configuration</button>
        </div>
      );
    }

    return null;
  };

  // Modify this method to close the modal after saving
  const handleSaveConfig = () => {
    alert("Node configuration saved!");
    addNode(selectedNode);
    setSelectedNode(null);
    setShowModal(false); // Close the modal after saving
  };

  return (
    <div className="node-page">
      <h1>Dynamic Node-Based UI</h1>
      <div className="node-select">
        <label>Select a Node Type:</label>
        <select onChange={(e) => handleNodeSelect(e.target.value)}>
          <option value="">Select a node type</option>
          {/* <option value="csv">CSV Node</option>
          <option value="text">Text Node</option> */}
          {Object.keys(nodeConfigs).map((nodeType) => (
            <option key={nodeType} value={nodeType}>
              {nodeConfigs[nodeType].label}
            </option>
          ))}
          {/* Add more options for other node types */}
        </select>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {renderNodeUI()}
      </Modal>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          {nodes
            .sort((a, b) => a.order - b.order)
            .map((node, index) => (
              <tr key={index} onClick={() => setSelectedNode(node)}>
                <td>{node.type}</td>
                <td>{node.order}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkflowBuilder;
