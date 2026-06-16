import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h4>Stock App</h4>}

        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <nav>
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
      </nav>
    </aside>
  );
}

export default Sidebar;
