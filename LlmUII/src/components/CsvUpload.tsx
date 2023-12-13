import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import TutorialDataService from "../services/TutorialService";
import ITutorialData from "../types/Tutorial";
type CSVHeaders = string[];
type CSVData = { [key: string]: boolean }[];

interface DropdownOption {
  label: string;
  value: string;
}

interface Relation {
  header1: string;
  header2: string;
  relation: string;
}

interface Combination {
  option1: string;
  option2: string;
  option3: string;
}

const CsvUpload: React.FC = () => {


  const [combinations, setCombinations] = useState<Combination[]>([
    { option1: "", option2: "", option3: "" },
  ]);
  const [headers, setHeaders] = useState<CSVHeaders>([]);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);

  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([headers[0] ?? '', headers[1] ?? '']);
  const [relationInputs, setRelationInputs] = useState<string[]>(['']);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csv = reader.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        setHeaders(headers);
        const options = headers.map((header) => ({ label: header, value: header }));
        setDropdownOptions(options);
        setSelectedHeaders([headers[0] ?? '', headers[1] ?? '']);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectHeader = (index: number, value: string) => {
    const updatedHeaders = [...selectedHeaders];
    updatedHeaders[index] = value;
    setSelectedHeaders(updatedHeaders);
  };

  const handleRelationChange = (index: number, value: string) => {
    const updatedRelations = [...relations];
    updatedRelations[index] = { header1: selectedHeaders[0], header2: selectedHeaders[1], relation: value };
    setRelations(updatedRelations);
  };

  const handleAddRow = () => {
    const updatedRelationInputs = [...relationInputs, ''];
    setRelationInputs(updatedRelationInputs);
    const newSelectedHeaders = [headers[0] ?? '', headers[1] ?? '']; // create new array
    setSelectedHeaders([...selectedHeaders, ...newSelectedHeaders]); // concatenate arrays
    const updatedRelations = [...relations, { header1: newSelectedHeaders[0], header2: newSelectedHeaders[1], relation: '' }];
    setRelations(updatedRelations);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(relations); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileUpload} />
        {relationInputs.map((input, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <label htmlFor={`header1-${index}`}>Header 1:</label>
            <select
              id={`header1-${index}`}
              value={selectedHeaders[0]}
              onChange={(event) => handleSelectHeader(0, event.target.value)}
            >
              <option value="">Select a header</option>
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor={`header2-${index}`} style={{ marginLeft: 10 }}>Header 2:</label>
            <select
              id={`header2-${index}`}
              value={selectedHeaders[1]}
              onChange={(event) => handleSelectHeader(1, event.target.value)}
              style={{ marginLeft: 5 }}
            >
              <option value="">Select a header</option>



    {dropdownOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor={`relation-${index}`} style={{ marginLeft: 10 }}>Relation:</label>
      <input
        type="text"
        id={`relation-${index}`}
        value={relations[index]?.relation ?? ''}
        onChange={(event) => handleRelationChange(index, event.target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    ))}
    <button type="button" onClick={handleAddRow}>Add</button>
    <button type="submit">Submit</button>
  </form>
</div>
);
};

export default CsvUpload;
