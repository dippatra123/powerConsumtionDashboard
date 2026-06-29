import "./App.css";
import Login from "./component/Login";
import Sidebar from "./component/Sidebar";
import DashboardPage from "./component/DashboardPage";
import EnergyDataPage from "./component/EnergyDataPage";
import MachineAnalyticPage from "./component/MachineAnalyticPage";

import Report from "./component/Report";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./Features/AuthSlice";

const Layout = ({ collapsed, setCollapsed }) => {
  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            isAuthenticated ? (
              <Layout collapsed={collapsed} setCollapsed={setCollapsed} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/to_energyData" element={<EnergyDataPage />} />
          <Route
            path="/to_machineAnalytics"
            element={<MachineAnalyticPage />}
          />
          <Route path="/to_report" element={<Report />} />
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
