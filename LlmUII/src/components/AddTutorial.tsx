import React, { useState, ChangeEvent } from "react";
import TutorialDataService from "../services/TutorialService";
import axios from "axios";
import ITutorialData from '../types/Tutorial';
import authHeader from "../services/auth-header";
const AddTutorial: React.FC = () => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
    language:"",
    script:"",
    parameters:""

  };
  const [tutorial, setTutorial] = useState<ITutorialData>(initialTutorialState);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
  };

  const saveTutorial = async () => {
    var data = {
      title: tutorial.title,
      description: tutorial.description,
      language: tutorial.language,
      script: tutorial.script,
      parameters: tutorial.parameters,
      
    };
await axios.post("/api/tutorials", data, { headers: authHeader() }) // Replace "/api/tutorials" with your actual API endpoint
    .then((response) => {
      setTutorial({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        published: response.data.published,
        language: response.data.language,
        script: response.data.script,
        parameters: response.data.parameters
      });
      setSubmitted(true);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const newTutorial = () => {
    setTutorial(initialTutorialState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newTutorial}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={tutorial.title}
              onChange={handleInputChange}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={tutorial.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              className="form-control"
              id="language"
              required
              value={tutorial.language}
              onChange={handleInputChange}
              name="language"
            />
          </div>
 
          {/* <div >
            <label htmlFor="script">Script</label>
            <textarea   id="script"  name="script" value={tutorial.parameters} rows={4} cols={40}  />
          </div> */}
       <div className="form-group">
            <label htmlFor="parameters">ScriptName</label>
            <input
              type="textarea"
              className="form-control"
              id="script"
              required
              value={tutorial.script}
              onChange={handleInputChange}
              name="script"
            />
          </div>
          <div className="form-group">
            <label htmlFor="parameters">Parameters</label>
            <input
              type="textarea"
              className="form-control"
              id="parameters"
              required
              value={tutorial.parameters}
              onChange={handleInputChange}
              name="parameters"
            />
          </div>

          <button onClick={saveTutorial} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTutorial;
