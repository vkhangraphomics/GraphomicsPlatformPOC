import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authHeader from "../services/auth-header";
import TutorialDataService from "../services/TutorialService";
import ITutorialData from "../types/Tutorial";
import "../styles/All.css";
import axios from "axios";
interface DropdownOption {
  value: string;
  label: string;
}

const relation: DropdownOption[] = [];

interface Combination {
  header1: string;
  relation: string;
  header2: string;
}
axios.defaults.baseURL = "http://localhost:8080";
const CsvUpload12: React.FC = () => {
  const [relationships, setRelationships] = useState<DropdownOption[]>([]);
  type CSVHeaders = string[];
  const [headers, setHeaders] = useState<CSVHeaders>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [combinations, setCombinations] = useState<Combination[]>([
    { header1: "", relation: "", header2: "" },
  ]);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const handleAddCombination = () => {
    setCombinations([
      ...combinations,
      { header1: "", relation: "", header2: "" },
    ]);
  };

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const response = await axios.get("/api/relationships", {
          headers: authHeader(),
        });
        if (response.data) {
          const relationshipOptions: DropdownOption[] = response.data.map(
            (item: any) => ({
              value: item.relationshipName,
              label: item.relationshipName,
            })
          );
          setRelationships(relationshipOptions);
        }
      } catch (error) {
        console.error("Error fetching relationships:", error);
      }
    };
    fetchRelationships();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        setHeaders(headers);
        const options = headers.map((header) => ({
          label: header,
          value: header,
        }));
        setDropdownOptions(options);
        setCsvFile(file);
      };
      reader.readAsText(file);
    }
  };

  const handleCombinationChange = (
    index: number,
    field: keyof Combination,
    value: string
  ) => {
    setCombinations((prev) =>
      prev.map((combination, i) =>
        i === index ? { ...combination, [field]: value } : combination
      )
    );
  };
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false); // State for success alert

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("relation", JSON.stringify(combinations)); // Append the headers to the form data

    try {
      const response = await axios.post("/api/upload-csv", formData, {
        headers: authHeader(),
      });
      console.log(response.data);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000); // Hide after 3 seconds
      setCsvFile(null);
      setHeaders([]);
      setDropdownOptions([]);
      setCombinations([{ header1: "", relation: "", header2: "" }]);
    } catch (error) {
      console.error(error);
    }
    console.log(combinations);
    // Here you can submit the combinations to your server
  };

  return (
    <div className="csv-upload-container">
      {showSuccessAlert && (
        <div className="success-alert">Successfully uploaded!</div>
      )}
      <form onSubmit={handleSubmit} className="csv-upload-form">
        <input type="file" onChange={handleFileUpload} />
        {combinations.map((combination, index) => (
          <div key={index}>
            <select
              value={combination.header1}
              onChange={(e) =>
                handleCombinationChange(index, "header1", e.target.value)
              }
            >
              <option value="">-- Select Node 1 --</option>
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={combination.relation}
              onChange={(e) =>
                handleCombinationChange(index, "relation", e.target.value)
              }
            >
              <option value="">-- Select Relation --</option>
              {relationships.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={combination.header2}
              onChange={(e) =>
                handleCombinationChange(index, "header2", e.target.value)
              }
            >
              <option value="">-- Select Node 2 --</option>
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          className="btn add-btn"
          type="button"
          onClick={handleAddCombination}
        >
          Add
        </button>
        <button className="btn submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CsvUpload12;
