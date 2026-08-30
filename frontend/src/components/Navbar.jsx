import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
const links = [
  { to: "/", label: "HOME" },
  { to: "/telemetry", label: "TELEMETRY" },
  { to: "/teams", label: "TEAMS" },
  { to: "/standings", label: "STANDINGS" },
  { to: "/schedule", label: "SCHEDULE" },
  { to: "/circuit", label: "CIRCUIT" },
  { to: "/summary", label: "SUMMARY" },
];
  return (
    <nav className="f1-navbar">
      <div className="f1-navbar-inner">
      <Link to="/" className="f1-nav-logo">
  F1<span className="f1-logo-accent">AIXCEL.</span>
</Link>
        <div className="f1-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "f1-nav-tab active" : "f1-nav-tab"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="f1-navbar-underline" />
    </nav>
  );
}

export default Navbar;