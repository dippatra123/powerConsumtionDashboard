import "./App.css";
import Login from "./component/Login";
import Sidebar from "./component/Sidebar";
import DashboardPage from "./component/DashboardPage";
import EntryPage from "./component/EntryPage";
import UploadCode from "./component/UploadCode";
import Reconcile from "./component/Reconcile";
import Audit from "./component/Audit";
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
          <Route path="/entryPage" element={<EntryPage />} />
          <Route path="/get_excel" element={<UploadCode />} />
          <Route path="/get_reconsile_file" element={<Reconcile />} />
          <Route path="/audit" element={<Audit />} />
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
