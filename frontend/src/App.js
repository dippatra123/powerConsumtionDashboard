import "./App.css";
import Login from "./component/Login";
import Sidebar from "./component/Sidebar";
import DashboardPage from "./component/DashboardPage";
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
          <Route path="/" element={<DashboardPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
