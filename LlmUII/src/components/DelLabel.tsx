import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/DelLabel.css";
import authHeader from "../services/auth-header";

interface Option {
  label: string;
  value: string;
}
  type MyData = {
    id: string;
    startNodeLabel: string;
    relationshipType: string;
    endNodeLabel: string;
  };
  
  
type CSVData = { [key: string]: boolean }[];
const DelLabel: React.FC = () => {

  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileDownloaded, setFileDownloaded] = useState<boolean>(false);

  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8080/api/getLabels", { headers: authHeader() });
      setOptions(
        result.data.map((option: string) => ({ label: option, value: option }))
      );
    };
    fetchData();
  }, []);

  const downloadFile = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:8080/api/getLabelData");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setFileUrl(url);
      setFileDownloaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  
  const confirmDelete = async (): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await axios.delete("http://localhost:8080/api/delLabelData");
        // additional code here to handle successful delete
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleOptionChange = (value: string) => {
    const isSelected = selectedOptions.includes(value);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const handleSubmit = async () => {
    const result = await axios.post("http://localhost:8080/api/delLabelData", {
      selectedOptions,
    });
    console.log(result.data);
  };

  return (
    <div className="del-label-container">
      {options.map((option) => (
        <div className="option-group" key={option.value}>
          <input
            type="checkbox"
            checked={selectedOptions.includes(option.value)}
            onChange={() => handleOptionChange(option.value)}
          />
          <label>{option.label}</label>
        </div>
      ))}
      <button className="download-btn" onClick={handleSubmit}>Submit</button>

      {fileDownloaded && (
        <div className="download-section">
          <a href={fileUrl} download>
            Download Link
          </a>
          <button onClick={confirmDelete}>Delete File</button>
        </div>
      )}
    </div>
);

};




export default DelLabel;
