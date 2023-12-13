// import React, { useState, useEffect, ChangeEvent } from "react";
// import { useParams, useNavigate } from 'react-router-dom';

// import TutorialDataService from "../services/TutorialService";
// import ITutorialData from "../types/Tutorial";
// import axios from "axios";
// import authHeader from "../services/auth-header";

// const Execute: React.FC = () => {
//   const { id }= useParams();
//   let navigate = useNavigate();

//   const initialTutorialState = {
//     id: null,
//     title: "",
//     description: "",
//     published: false,
//     language:"",
//     script:"",
//     parameters:""
//   };
//   const [currentTutorial, setCurrentTutorial] = useState<ITutorialData>(initialTutorialState);
//   const [message, setMessage] = useState<string>("");

//   const getTutorial = (id: string) => {
//     TutorialDataService.get(id)
//       .then((response: any) => {
//         setCurrentTutorial(response.data);
//         console.log(response.data);
//       })
//       .catch((e: Error) => {
//         console.log(e);
//       });
//   };

//   useEffect(() => {
//     if (id)
//       getTutorial(id);
//   }, [id]);



//   const execute = () => {
//    axios.post("/api/execute",null ,{ headers: authHeader() })
//       .then((response: any) => {
//         console.log(response.data);
//         setMessage("Script triggered");
//       })
//       .catch((e: Error) => {
//         console.log(e);
//       });
//   };

//   const deleteTutorial = () => {
//     TutorialDataService.remove(currentTutorial.id)
//       .then((response: any) => {
//         console.log(response.data);
//         navigate("/tutorials");
//       })
//       .catch((e: Error) => {
//         console.log(e);
//       });
//   };

//   return (
//     <div>
//         <button
//             type="submit"
//             className="badge badge-success"
//             onClick={execute}
//           >
//             Execute
//           </button>
//     </div>
//   );
// };

// export default Execute;



import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";

interface IWorkflow {
  id: string;
  name: string;
}

const Execute: React.FC = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Fetch list of workflows from your API
    const options = {
      method: "GET",
      headers: authHeader(),
    };

    axios.get("http://localhost:8080/api/getWorkflows", { headers: authHeader() })
      .then((response: any) => {
        setWorkflows(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, []);

  const executeWorkflow = (workflowName: string) => {
    // Execute API call here
    axios.post(
      "/api/execute",
      { workflowName },
      {
        headers: {
          ...authHeader(),
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response: any) => {
      console.log(response.data);
      setMessage(`Executed workflow: ${workflowName}`);
    })
    .catch((e: Error) => {
      console.log(e);
      setMessage(`Failed to execute workflow: ${workflowName}`);
    });
  };

  return (
    <div>
      <h2>List of Workflows</h2>
      <ul>
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            {workflow.name}
            <button
              type="button"
              className="badge badge-success"
              onClick={() => executeWorkflow(workflow.name)}
            >
              Execute
            </button>
          </li>
        ))}
      </ul>
      <div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Execute;

