import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";
import  "../styles/App1.css";


type Relationship = {
    id: string;
    relationshipName: string;
    // ... other fields
};

const Relationships: React.FC = () => {
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [visibleRelationships, setVisibleRelationships] = useState<Relationship[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newRelationship, setNewRelationship] = useState('');

    const ITEMS_PER_PAGE = 20;

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/relationships", { headers: authHeader() });
            console.log(response)
            
                setRelationships(response.data);
           
        } catch (error) {
            console.error("Error fetching relationships:", error);
        }
    };

      

    

    useEffect(() => {
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        setVisibleRelationships(relationships.slice(startIndex, endIndex));
    }, [relationships, currentPage]);

    const handleAdd = async () => {
        try {
            await axios.post("http://localhost:8080/api/relationships", { relationshipName: newRelationship }, { headers: authHeader() });
            setNewRelationship('');
            setCurrentPage(1); // optionally, if you want to reset to the first page after adding a new item
        } catch (error) {
            console.error("Error adding new relationship:", error);
        }
    };

    const totalPages = Math.ceil(relationships.length / ITEMS_PER_PAGE);

    return (
        <div className= ".container" >
    <button onClick={fetchData} className=".addButton">Get Relationships</button>
    <ul className=".list">
        {visibleRelationships.map(rel => (
            <li key={rel.id} className=".listItem">{rel.relationshipName}</li>
        ))}
    </ul>

    <div className=".pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
            <button key={index} onClick={() => setCurrentPage(index + 1)} className= ".pageButton">
                {index + 1}
            </button>
        ))}
    </div>

    <div>
        <input value={newRelationship} onChange={e => setNewRelationship(e.target.value)} placeholder="New relationship type" className= ".inputField" />
        <button onClick={handleAdd} className=".addButton">Add</button>
    </div>
</div>

    );
};

export default Relationships;
