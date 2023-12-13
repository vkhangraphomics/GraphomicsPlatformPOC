import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App1.css";

import AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import logo from "./logo2.png";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import AddTutorial from "./components/AddTutorial";
import Tutorial from "./components/Tutorial";
import TutorialsList from "./components/TutorialsList";
import Execute from "./components/Execute";
import CsvUpload from "./components/CsvUpload";
import CsvUpload12 from "./components/CsvUpload12";
import EditRelation from "./components/editRelation";
import DelLabel from "./components/DelLabel";
import EventBus from "./common/EventBus";
import Visualization from "./components/Visualization";
import DataUpload from "./components/DataUpload";
import Relationships from "./components/Relationships";
import WorkflowBuilder from "./components/WorkflowBuilder";
import WorkflowList from "./components/WorkflowList";
import FolderTree from "./components/FolderTree";
import MainComponent from "./components/MainComponent";
import NotebookViewer from "./components/NotebookViewer";
import NotebookExecute from "./components/NotebookExecute";
import NotebookEditor from "./components/NotebookEditor";
type Props = {};

type State = {
  showModeratorBoard: boolean;
  showAdminBoard: boolean;
  currentUser: IUser | undefined;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div className="app-container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"}>
            {" "}
            <img src={logo} alt="Graphomics Logo" className="logo2" />
          </Link>

          {/* {currentUser ? ( */}
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                {" "}
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>{" "}
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Process Automation
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to={"/workflow"} className="dropdown-item">
                    Workflows
                  </Link>
                  <Link to={"/setup"} className="dropdown-item">
                    Initial Setup
                  </Link>
                  <Link to={"/workflowlist"} className="dropdown-item">
                    Workflow List
                  </Link>
                  <Link to={"/jynb"} className="dropdown-item">
                    Notebook Viwer
                  </Link>
                  <Link to={"/jynbexe"} className="dropdown-item">
                    Notebook execute
                  </Link>
                  <Link to={"/jynbedit"} className="dropdown-item">
                    Notebook Editor
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                {" "}
                <Link to={"/visual"} className="nav-link">
                  Visualization
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li> */}
            </div>
          )}
        </nav>

        <div className="container-fluid">
          {/* <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
              <div className="position-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to={"/home"} className="nav-link">
                      Home
                    </Link>
                  </li>
                  <hr />

                  <li className="nav-item">
                    <Link to={"/visual"} className="nav-link">
                      Visualization
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/workflow"} className="nav-link">
                      Workflow
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/workflowlist"} className="nav-link">
                      Workflow List
                    </Link>
                  </li>
                  <hr />

                  {currentUser && (
                    <>
                      <li className="nav-item">
                        <Link to={"/loadData"} className="nav-link">
                          Initial Setup
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/tutorials"} className="nav-link">
                          Workflow
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/add"} className="nav-link">
                          Add
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/execute"} className="nav-link">
                          Execute
                        </Link>
                      </li>
                      <hr />
                    </>
                  )}

                  {currentUser && (
                    <>
                      <li className="nav-item">
                        <Link to={"/csvupload"} className="nav-link">
                          CSV upload
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/editRel"} className="nav-link">
                          Edit Relationships
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/delLabel"} className="nav-link">
                          Delete Labels
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/relationships"} className="nav-link">
                          Relationships pool
                        </Link>
                      </li>
                      <hr />
                    </>
                  )}

                  {showModeratorBoard && (
                    <li className="nav-item">
                      <Link to={"/mod"} className="nav-link">
                        Moderator Board
                      </Link>
                    </li>
                  )}

                  {showAdminBoard && (
                    <li className="nav-item">
                      <Link to={"/admin"} className="nav-link">
                        Admin Board
                      </Link>
                    </li>
                  )}

                  {currentUser && (
                    <li className="nav-item">
                      <Link to={"/user"} className="nav-link">
                        User
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </nav> */}

          <main className="col-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user" element={<BoardUser />} />
              <Route path="/mod" element={<BoardModerator />} />
              <Route path="/admin" element={<BoardAdmin />} />
              <Route path="/tutorials" element={<TutorialsList />} />
              <Route path="/add" element={<AddTutorial />} />
              <Route path="/tutorials/:id" element={<Tutorial />} />
              <Route path="/execute" element={<Execute />} />
              <Route path="/csvupload" element={<CsvUpload12 />} />
              <Route path="/editRel" element={<EditRelation />} />
              <Route path="/delLabel" element={<DelLabel />} />
              <Route path="/loadData" element={<DataUpload />} />
              <Route path="/visual" element={<Visualization />} />
              <Route path="/workflow" element={<WorkflowBuilder />} />
              <Route path="/relationships" element={<Relationships />} />
              <Route path="/workflowlist" element={<WorkflowList />} />
              <Route path="/jynbedit" element={<NotebookEditor />} />
              <Route path="/setup" element={<MainComponent />} />
              <Route path="/jynb" element={<NotebookViewer />} />
              <Route path="/jynbexe" element={<NotebookExecute />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
