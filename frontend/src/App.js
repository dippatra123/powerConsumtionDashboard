import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import login from "./component/Login";
import Sidebar from "./component/Sidebar";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="App">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  );
}

export default App;
