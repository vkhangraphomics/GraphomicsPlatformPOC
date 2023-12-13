import React, { useState, useEffect, ChangeEvent } from "react";
import TutorialDataService from "../services/TutorialService";
import { Link } from "react-router-dom";
import ITutorialData from '../types/Tutorial';
import axios from "axios";
import authHeader from "../services/auth-header";

const TutorialsList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Array<ITutorialData>>([]);
  const [currentTutorial, setCurrentTutorial] = useState<ITutorialData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [searchTitle, setSearchTitle] = useState<string>("");

  useEffect(() => {
    retrieveTutorials();
  }, []);

  const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  // const retrieveTutorials = () => {
  //   TutorialDataService.getAll()
  //     .then((response: any) => {
  //       setTutorials(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((e: Error) => {
  //       console.log(e);
  //     });
  // };


  

  
  const retrieveTutorials = () => {
    //await axios.get("http://localhost:8080/api/getLabels", { headers: authHeader() });
    axios.get('http://localhost:8080/api/tutorials', { headers: authHeader() }) // replace with the actual endpoint
        .then(response => {
          setTutorials(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
  };
  

  const refreshList = () => {
    retrieveTutorials();
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial: ITutorialData, index: number) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    TutorialDataService.removeAll()
      .then((response: any) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    TutorialDataService.findByTitle(searchTitle)
      .then((response: any) => {
        setTutorials(response.data);
        setCurrentTutorial(null);
        setCurrentIndex(-1);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        
      </div>
      <div className="col-md-6">
        <h4>Workflow stages</h4>

        <ul className="list-group">
          {tutorials &&
            tutorials.map((tutorial, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTutorial(tutorial, index)}
                key={index}
              >
                {tutorial.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentTutorial ? (
          <div>
            <h4>Tutorial</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentTutorial.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentTutorial.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentTutorial.published ? "Published" : "Pending"}
            </div>

            <Link
              to={"/tutorials/" + currentTutorial.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsList;
