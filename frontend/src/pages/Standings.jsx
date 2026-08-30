import { useState, useEffect } from "react";
import { getDriverStandings, getConstructorStandings } from "../api/client";

function Standings() {
  const [year, setYear] = useState(2026);
  const [activeTab, setActiveTab] = useState("drivers"); // "drivers" | "teams"
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStandings = async (selectedYear = year) => {
    setLoading(true);
    setError(null);
    try {
      const [d, c] = await Promise.all([
        getDriverStandings(selectedYear),
        getConstructorStandings(selectedYear),
      ]);
      setDrivers(d.standings || []);
      setConstructors(c.standings || []);
    } catch (err) {
      setError("Could not load standings for that year.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings(year);
  }, [year]);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="f1-page">
      {/* ===== Navbar ===== */}
      <div className="standings-navbar">
        <div className="standings-year-select">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="standings-tabs">
          <button
            className={`standings-tab ${activeTab === "drivers" ? "active" : ""}`}
            onClick={() => setActiveTab("drivers")}
          >
            Drivers
          </button>
          <button
            className={`standings-tab ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Teams
          </button>
        </div>
      </div>

      {error && <p className="f1-error">{error}</p>}
      {loading && <p className="f1-loading">Loading standings...</p>}

      {/* ===== Drivers Table ===== */}
      {activeTab === "drivers" && !loading && (
        <div className="standings-table-wrapper">
          <div className="standings-table">
            {/* Header - 4 columns */}
            <div className="standings-header-row">
              <span className="col-pos">POS.</span>
              <span className="col-driver">DRIVER</span>
              <span className="col-team">TEAM</span>
              <span className="col-pts">PTS.</span>
            </div>

            {drivers.map((d, i) => (
              <div className="standings-row" key={d.driverId || i}>
                <span className="col-pos">{d.position}</span>

                <div className="col-driver">
                  <div
                    className="driver-avatar-circle"
                    style={{ backgroundColor: d.teamColor || "#333" }}
                  >
                    {getInitials(d.driverName)}
                  </div>
                  <span className="driver-name">{d.driverName}</span>
                </div>

                <div className="col-team">
                  <span
                    className="team-dot"
                    style={{ backgroundColor: d.teamColor || "#666" }}
                  />
                  <span>{d.team || d.constructorName}</span>
                </div>

                <span className="col-pts">{d.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Teams / Constructors Table ===== */}
      {activeTab === "teams" && !loading && (
        <div className="standings-table-wrapper">
          <div className="standings-table constructors-table">
            {/* Header - 3 columns */}
            <div className="standings-header-row">
              <span className="col-pos">POS.</span>
              <span className="col-team">TEAM</span>
              <span className="col-pts">PTS.</span>
            </div>

            {constructors.map((c, i) => (
              <div className="standings-row" key={c.constructorId || i}>
                <span className="col-pos">{c.position}</span>

                <div className="col-team">
                  <span
                    className="team-dot"
                    style={{ backgroundColor: c.teamColor || "#666" }}
                  />
                  <span>{c.constructorName}</span>
                </div>

                <span className="col-pts">{c.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Standings;