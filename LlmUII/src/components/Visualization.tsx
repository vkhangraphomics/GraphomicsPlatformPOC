import "../styles/App.css";
import WikiGraph from "./wikigraph";
import { WikiSummary } from "./sidebar/wikipediaSummaries";
import Sidebar from "./sidebar";
import { VisNetwork, Vis, visLoader } from "../api/vis/vis";
import { VisContext } from "../context/visContext";
import NeoVis, { NeoVisEvents } from "neovis.js";
import Alert, { AlertState, AlertType } from "./alert";
import styled from "styled-components";
import ExpandButton from "./buttons/expand";
import CenterButton from "./buttons/center";
import StabilizeButton from "./buttons/stabilize";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import authHeader from "../services/auth-header";
import { json } from "react-router-dom";

// height: ${(props) => (props.theme.expanded ? "100%;" : "80%;")}
// width: ${(props) => (props.theme.expanded ? "100%;" : "60%;")}
// top: ${(props) => (props.theme.expanded ? "0px;" : "inherit;")}
// left: ${(props) => (props.theme.expanded ? "20px;" : "inherit;")}
// z-index: ${(props) => (props.theme.expanded ? "10000;" : "0;")}
// position: fixed;
// const StyledVisContainer = styled.div`
//     height: "100%;"
//     width: "60%;"
//     top: 0px
//     left: 0px

//     //position: fixed;

//     @media (max-width: 1100px) {
//         height: "100%;"
//         width: "100%;"
//     }
// `;
const StyledVisContainer = styled.div`
  height: 40%; /* Set the height when expanded */
  width: 100%; /* Set the width when expanded */
  top: 0px; /* Set the top position when expanded */
  left: 0px; /* Set the left position when expanded */
  z-index: 10; /* Set the z-index when expanded */

  @media (max-width: 768px) {
    height: 75%; /* Set the height when not expanded and at a smaller screen width */
    width: 90%; /* Set the width when not expanded and at a smaller screen width */
  }
`;

const PageContainer = styled.div`
  display: flex;
  height: 50vh;
  width: 100%;
`;

const SidePanel = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// StyledVisContainer.defaultProps = {
//     theme: {
//         expanded: false,
//     },
// };

const GraphContainer = styled.div`
  flex: 1;
  display: flex;

  // justify-content: center;
  // align-items: center;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
`;
// const GraphAndTableContainer = styled.div`
//     display: flex;
//     flex-direction: column;
// `;

const GraphAndTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  margin-top: 40px; /* Add margin to move it down */
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Arial, sans-serif; /* Change the font */
`;

const ResultText = styled.div`
  font-size: 18px;
  text-align: center;
`;

const Visualization: React.FC = () => {
  // keep vis object in state
  const [vis, setVis] = useState<Vis | null>(null);
  const [visNetwork, setVisNetwork] = useState<VisNetwork | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  // set initial theme and keep track of dark mode state
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  // handle change in dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // keep track of whether the vis is expanded
  const [visIsExpanded, setVisIsExpanded] = useState(false);

  // load Vis and VisNetwork objects
  useEffect(() => {
    const onReady = (vis: NeoVis, e: any) => {
      if (!vis.network) {
        return;
      }
      setVis(new Vis(vis));
      setVisNetwork(new VisNetwork(vis.network));
      // register record count event
      vis.registerOnEvent(NeoVisEvents.CompletionEvent, (e) => {
        setRecordCount(e.recordCount);
      });
    };
    visLoader.load(onReady);
    return () => {
      setVis(null);
      setVisNetwork(null);
    };
  }, []);

  // keep track of summaries
  // TODO: combine into one object
  const [summaries, setSummaries] = useState<WikiSummary[]>([]);
  const [currentSummary, setCurrentSummary] = useState<WikiSummary | null>(
    null
  );

  // keep track of search bar input
  const [input, setInput] = useState("");

  // keep track of record count status
  const [recordCount, setRecordCount] = useState(-1);
  const [comment, setComment] = useState<string>("");
  const [result, setResult] = useState<any | null>(null);

  // keep track of alert status
  const [alertState, setAlertState] = useState<AlertState>({
    show: false,
    type: AlertType.None,
  });

  const handleDropdownChange = (selected: string[]) => {
    setSelectedOptions(selected);
    console.log(selected);

    const cypherQuery = generateCypherQuery(selected);
    console.log(cypherQuery);
    vis?.renderWithCypher(cypherQuery);
  };
  const [cypherQueryInput, setCypherQueryInput] = useState("");

  // handle reload button click and update the graph with the new Cypher query
  const headers = {
    "Content-Type": "application/json",
  };
  const mergedHeaders = { ...headers, ...authHeader() };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const handleReloadButtonClick = async () => {
    const response = await axios.post(
      "http://localhost:8080/api/runQuery",
      JSON.stringify({ query: cypherQueryInput }),
      { headers: mergedHeaders }
    );

    const data = response.data;
    new Promise((resolve) => setTimeout(resolve, 2000));
    // Extract column headers and rows from data.
    // The structure of 'data' will depend on your API's response format.
    const columns = Object.keys(data[0] || {}); // Example for extraction
    const rows = data; // Example for extraction
    await sleep(5000);
    // Update the table in the DOM with the results.
    const table = document.getElementById("resultsTable");

    // Populate column headers
    const thead = table?.querySelector("thead tr");
    thead.innerHTML = columns.map((col) => `<th>${col}</th>`).join("");

    // Populate rows
    const tbody = table?.querySelector("tbody");
    tbody.innerHTML = rows
      .map(
        (row) => `
      <tr>
        ${columns.map((col) => `<td>${JSON.stringify(row[col])}</td>`).join("")}
      </tr>
    `
      )
      .join("");

    if (vis && cypherQueryInput.trim() !== "") {
      vis.renderWithCypher(cypherQueryInput);
    }
  };
  const [QueryInput, setQueryInput] = useState("");
  const handleClickReloadButtonClick = () => {
    if (vis && cypherQueryInput.trim() !== "") {
      vis.renderWithCypher(QueryInput);
    }
  };
  const [customQuery, setCustomQuery] = useState("");
  const handleCustomQueryButtonClick = async () => {
    try {
      // Make the API call (replace URL and method as needed)
      // const response = await axios.post("http://localhost:8080/api/nltocypher", {
      const response = await axios.post(
        "http://localhost:8080/api/llm",
        {
          query: customQuery,
        },
        { headers: authHeader() }
      );

      // Extract 'query' field from the returned JSON object
      const newCypherQuery = response.data.query;
      const replacedQuery = newCypherQuery.replace("[", "[r");

      const secondOccurrenceIndex = replacedQuery.indexOf(
        "t1",
        replacedQuery.indexOf("t1") + 1
      );

      // If found, trim the query from the start to the second occurrence of 't1'
      const trimmedQuery =
        secondOccurrenceIndex !== -1
          ? replacedQuery.substring(0, secondOccurrenceIndex + 2)
          : replacedQuery;

      // Append ',t2 LIMIT 20' to the trimmed query
      const finalQuery = `${trimmedQuery},r,t2 LIMIT 20`;
      //finalQuery='match (t1:ASV_ID)-[r:APPEARED_IN]->(t2:Location) where t2.name = "C3_25" return t1,r,t2 LIMIT 20'
      console.log(finalQuery);
      // Update the graph
      if (vis && finalQuery.trim() !== "") {
        vis.renderWithCypher(finalQuery);
      }
    } catch (error) {
      console.error("Error with the API call:", error);
      // You can set an alert state here if you want to notify the user
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/getLabels",
          { headers: authHeader() }
        );
        setOptions(
          response.data.map((option: string) => ({
            label: option,
            value: option,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const generateCypherQuery = (labels: string[]) => {
    let cypherQuery = "MATCH (n) WHERE ";

    labels.forEach((label, index) => {
      cypherQuery += ` n:${label} `;
      if (index !== labels.length - 1) {
        cypherQuery += " OR ";
      }
    });

    cypherQuery += " MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100";
    return cypherQuery;
  };

  // ----- alert user if something went wrong -----
  useEffect(() => {
    // recordCount = number of nodes returned in the query
    if (recordCount === 0) {
      // if there's 0 nodes, there was no such page found (happens when user searches for page that does not exist)
      setAlertState({ show: true, type: AlertType.NoArticleFound });
    } else if (recordCount === 1) {
      // if there's only 1 node, then user tried to expand a node that has no other links
      setAlertState({ show: true, type: AlertType.EndOfPath });
    }
    setRecordCount(-1);
  }, [recordCount]);
  const cleanAndFormatText1 = (text: string) => {
    // Remove ANSI escape codes (e.g., \u001b[1m, \u001b[32;1m, \u001b[0m)
    const cleanedText = text.replace(/\u001b\[\d+m/g, "");

    // Remove extra line breaks and leading/trailing whitespace
    const trimmedText = cleanedText.trim();

    // Replace multiple consecutive newlines with a single newline
    const formattedText = trimmedText.replace(/\n+/g, "\n");

    return formattedText;
  };

  const extractTextAfterMarker = (text: string, marker: string) => {
    const markerIndex = text.indexOf(marker);
    if (markerIndex !== -1) {
      const extractedText = text.substring(markerIndex + marker.length).trim();
      return extractedText;
    }
    return "";
  };

  const handleLLMApiCall = async () => {
    setResult(null);
    // Replace with your API endpoint and actual API call code.
    // This is a placeholder example.
    const response = await axios.post(
      "http://localhost:8080/api/llm",
      {
        query: customQuery,
      },
      { headers: authHeader() }
    );

    if (response.status === 200) {
      console.log(response.data);
      const queryResult = response.data.fullContext;
      vis?.renderWithCypher(response.data.query);
      //vis?.renderWithCypher("MATCH (n)-[r]->(m) RETURN n, r,m limit 100");
      // Replace newline characters with <br> tags
      const formattedResult = extractTextAfterMarker(
        queryResult,
        "> Finished chain."
      );
      var jsonResp = JSON.parse(queryResult);

      setResult(jsonResp);
    } else {
      console.error("API call error:", response.statusText);
      //setResult('Error occurred during API call');
    }
    console.log(response);
  };

  return (
    <div>
      <header>
        <h1>
          <strong>Graph Visualization</strong>
        </h1>
      </header>

      <PageContainer>
        <VisContext.Provider value={{ vis, visNetwork }}>
          <WikiGraph
            containerId={"vis"}
            summaries={summaries}
            setSummaries={setSummaries}
            setCurrentSummary={setCurrentSummary}
            setAlertState={setAlertState}
            darkMode={darkMode}
          />

          {/* buttons */}
          {/* <ExpandButton
                            visIsExpanded={visIsExpanded}
                            setVisIsExpanded={setVisIsExpanded}
                            darkMode={darkMode}
                        /> */}
          {/* <StabilizeButton vis={vis} />
                        <CenterButton visNetwork={visNetwork} /> */}
          {/* alert */}
          {/* <Alert state={alertState}></Alert> */}

          {/* sidebar */}
          {/* <Sidebar
                        input={input}
                        setInput={setInput}
                        summaries={summaries}
                        setSummaries={setSummaries}
                        currentSummary={currentSummary}
                        setCurrentSummary={setCurrentSummary}
                    /> */}
        </VisContext.Provider>
        {/* light/dark mode toggle */}

        {/* light/dark mode toggle */}
        <SidePanel>
          <textarea
            value={cypherQueryInput}
            onChange={(e) => setCypherQueryInput(e.target.value)}
            placeholder="Enter Cypher query..."
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />

          {/* Add a button to reload the graph */}
          <button onClick={handleReloadButtonClick}>Reload Graph</button>
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter custom query..."
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />

          <button onClick={handleLLMApiCall}>Submit Custom Query</button>

          <Select
            isMulti
            options={options} // Assuming you have an array of options to populate the dropdown
            onChange={(selected: any) =>
              handleDropdownChange(selected.map((item: any) => item.value))
            }
          />
        </SidePanel>
        {result && (
          <GraphAndTableContainer>
            <h2>Response Data</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, subIndex) => (
                      <td key={subIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GraphAndTableContainer>
        )}
        <GraphAndTableContainer>
          <table id="resultsTable">
            <thead>
              <tr>
                {/* <!-- This will be populated with column headers from the result --> */}
              </tr>
            </thead>
            <tbody>
              {/* <!-- This will be populated with rows from the result --> */}
            </tbody>
          </table>
        </GraphAndTableContainer>
      </PageContainer>

      {/* <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {result && (
          <GraphAndTableContainer>
            <h2>Response Data</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, subIndex) => (
                      <td key={subIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GraphAndTableContainer>
        )}
      </div> */}
    </div>
  );
};

export default Visualization;
