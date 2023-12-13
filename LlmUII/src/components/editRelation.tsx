import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import TutorialDataService from "../services/TutorialService";
import ITutorialData from "../types/Tutorial";
import { v4 as uuid } from 'uuid';
import axios from "axios";
import "../styles/EditRel.css";
import authHeader from "../services/auth-header";
type CSVHeaders = string[];

interface IData {
    id: number;
    name: string;
    email: string;
  }
  type MyData = {
    id: string;
    startNodeLabel: string;
    relationshipType: string;
    endNodeLabel: string;
  };
  
  
type CSVData = { [key: string]: boolean }[];
const EditRelation: React.FC = () => {
    const [data, setData] = useState<MyData[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const options = {
          method: "GET",
          headers: authHeader(),
        };
        const response = await fetch("http://localhost:8080/api/getRel",options);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    };
    const handleEditButtonClick = (id: string) => {
        setEditingId(id);
      };
    
      const handleSaveButtonClick = async (id: string) => {
        const newData = data.find(item => item.id === id);
        try {
          const response = await axios.post<MyData>('http://localhost:8080/api/editRel', newData, { headers: authHeader() });
          setEditingId(null);
          setData(prevData => prevData.map(item => (item.id === response.data.id ? response.data : item)));
        } catch (error) {
          console.error(error);
        }
      };

    //   const handleSaveButtonClick = async () => {
    //     const itemsToSave = data.filter(item => editingIds.has(item.id));
    //     try {
    //       const response = await axios.post<MyData[]>('https://example.com/api/data', itemsToSave);
    //       const updatedData = data.map(item => (editingIds.has(item.id) ? response.data.find(i => i.id === item.id)! : item));
    //       setData(updatedData);
    //       setEditingIds(new Set());
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };
    
      const handleInputChange = (id: string, field: keyof MyData, value: string | number | boolean) => {
        setData(prevData =>
          prevData.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
      };
    
      const renderField = (id: string, field: keyof MyData, value: string) => {
        if (editingId === id) {
          return (
            <input
              type="text"
              value={value}
              onChange={e => handleInputChange(id, field, e.target.value)}
            />
          );
        } else {
          return <p>{value}</p>;
        }
      };

    //   const renderField = (id: string, field: keyof MyData, value: string ) => {
    //     if (editingIds.has(id)) {
    //       return (
    //         <input
    //           type="text"
    //           value={value}
    //           onChange={e => handleInputChange(id, field, e.target.value)}
    //         />
    //       );
    //     } else {
    //       return <p>{value}</p>;
    //     }
    //   };
    
      const handleAddButtonClick = () => {
        const newId = uuid();
        const newItem: MyData = { id: newId, startNodeLabel: '', relationshipType: '', endNodeLabel: '' };
        setData(prevData => [...prevData, newItem]);
        setEditingId(newId);
      };
      return (
        <div className="container">
          <button onClick={fetchData} disabled={isFetching}>
            {isFetching ? "Loading..." : "Fetch Data"}
          </button>
          <table>
            <thead>
              <tr>
                <th>Start Node Label</th>
                <th>Relationship Type</th>
                <th>End Node Label</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{renderField(item.id, "startNodeLabel", item.startNodeLabel)}</td>
                  <td>{renderField(item.id, "relationshipType", item.relationshipType)}</td>
                  <td>{renderField(item.id, "endNodeLabel", item.endNodeLabel)}</td>
                  <td>
                    {editingId === item.id ? (
                      <button onClick={() => handleSaveButtonClick(item.id)}>Save</button>
                    ) : (
                      <button onClick={() => handleEditButtonClick(item.id)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddButtonClick}>Add</button>
        </div>
      );
      
  
  //   return (
  //     <div>
  //       <button onClick={fetchData} disabled={isFetching}>
  //         {isFetching ? "Loading..." : "Fetch Data"}
  //       </button>
  //       <div style={{ display: "table" }}>
  //   <div style={{ display: "table-header-group" }}>
  //     <div style={{ display: "table-cell", fontWeight: "bold" }}>
  //       Start Node Label
  //     </div>
  //     <div style={{ display: "table-cell", fontWeight: "bold" }}>
  //       Relationship Type
  //     </div>
  //     <div style={{ display: "table-cell", fontWeight: "bold" }}>
  //       End Node Label
  //     </div>
  //     <div style={{ display: "table-cell", fontWeight: "bold" }}></div>
  //   </div>

  //   {data.map((item) => (
  //     <div key={item.id} style={{ display: "table-row" }}>
  //       <div style={{ display: "table-cell" }}>
  //         {renderField(item.id, "startNodeLabel", item.startNodeLabel)}
  //       </div>
  //       <div style={{ display: "table-cell" }}>
  //         {renderField(item.id, "relationshipType", item.relationshipType)}
  //       </div>
  //       <div style={{ display: "table-cell" }}>
  //         {renderField(item.id, "endNodeLabel", item.endNodeLabel)}
  //       </div>
  //       <div style={{ display: "table-cell" }}>
  //         {editingId === item.id ? (
  //           <button onClick={() => handleSaveButtonClick(item.id)}>Save</button>
  //         ) : (
  //           <button onClick={() => handleEditButtonClick(item.id)}>Edit</button>
  //         )}
  //       </div>
  //     </div>
  //   ))}
  // </div>
        
  //     {/* {data.map(item => (
  //       <div key={item.id}  style={{ display: "flex" }}>
  //         {renderField(item.id, 'startNodeLabel', item.startNodeLabel)}
  //         {renderField(item.id, 'relationshipType', item.relationshipType)}
  //         {renderField(item.id, 'endNodeLabel', item.endNodeLabel)}
  //         {editingId === item.id ? (
  //           <button onClick={() => handleSaveButtonClick(item.id)}>Save</button>
  //         ) : (
  //           <button onClick={() => handleEditButtonClick(item.id)}>Edit</button>
  //         )}
  //       </div>
  //     ))} */}
  //   </div>
  // );
};
  
export default EditRelation;
