import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../asset/century-logo.png";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div
          className="logo-section"
          onClick={() => collapsed && setCollapsed(false)}
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

      <nav className="main-div">
        <div className="child-div">
          <NavLink
            to="/entryPage"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-warehouse"></i>
            {!collapsed && <span>Stock Entry</span>}
          </NavLink>

          <NavLink
            to="/get_excel"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-upload"></i>
            {!collapsed && <span>Upload Code</span>}
          </NavLink>

          <NavLink
            to="/get_reconsile_file"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-file"></i>
            {!collapsed && <span>Reconcile</span>}
          </NavLink>

          <NavLink
            to="/audit"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-chart-bar"></i>
            {!collapsed && <span>Audit</span>}
          </NavLink>

          <div className="logoutDiv">
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              {!collapsed && <span>Log Out</span>}
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
