import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Features/AuthSlice";
import "./sidebar.css";
import logo from "../asset/century-logo.png";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div
          className="logo-section"
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
            }
          }}
          style={{ cursor: collapsed ? "pointer" : "default" }}
        >
          <img src={logo} alt="Century Ply" className="logo-img" />
          {!collapsed && <h5>Century Ply</h5>}
        </div>

        {!collapsed && (
          <button className="toggle-btn" onClick={() => setCollapsed(true)}>
            <i className="fas fa-bars"></i>
          </button>
        )}
      </div>

      <div className="main-div">
        <div className="child-div">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-chart-line"></i>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/to_energyData"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-gauge-high"></i>
            {!collapsed && <span>Energy Data</span>}
          </NavLink>

          <NavLink
            to="/to_machineAnalytics"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-industry"></i>
            {!collapsed && <span>Machine Analytics</span>}
          </NavLink>

          <NavLink
            to="/to_report"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-file-lines"></i>
            {!collapsed && <span>Report</span>}
          </NavLink>

          <div className="logoutDiv">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              {!collapsed && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
