import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPersonImage, getDriverStandings, getPersonBio } from "../api/client";
import teamsData from "../data/teamsData";
import FlagIcon from "../components/FlagIcon";
import Spinner from "../components/Spinner";

const HISTORY_YEARS = [2022, 2023, 2024, 2025, 2026];

function DriverDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [imageUrl, setImageUrl] = useState(null);
  const [bio, setBio] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const teamInfo = teamsData.find((t) =>
    t.drivers.some((d) => d.name === decodedName)
  );
  const driverInfo = teamInfo?.drivers.find((d) => d.name === decodedName);

  useEffect(() => {
    getPersonImage(decodedName)
      .then((data) => setImageUrl(data.image_url))
      .catch((err) => console.error("Failed to load driver image:", err));

    getPersonBio(decodedName)
      .then((data) => setBio(data.bio))
      .catch((err) => console.error("Failed to load driver bio:", err));

    const lastName = decodedName.split(" ").pop().toLowerCase();

    Promise.all(
      HISTORY_YEARS.map((year) =>
        getDriverStandings(year)
          .then((data) => {
            const match = data.standings.find((s) =>
              s.driverName.toLowerCase().includes(lastName)
            );
            return match ? { year, ...match } : null;
          })
          .catch(() => null)
      )
    )
      .then((results) => {
        setHistory(results.filter(Boolean).reverse());
      })
      .finally(() => setLoading(false));
  }, [decodedName]);

  if (!driverInfo) {
    return (
      <div className="f1-page">
        <p className="f1-error">Driver not found.</p>
        <Link to="/teams" className="f1-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
          BACK TO TEAMS
        </Link>
      </div>
    );
  }

  return (
    <div className="f1-page" style={{ "--team-color": teamInfo.color }}>
      <Link to="/teams" className="back-link">← All drivers</Link>

      <div className="detail-hero" style={{ "--team-color": teamInfo.color }}>
        <div className="detail-hero-photo">
          {imageUrl ? (
            <img src={imageUrl} alt={decodedName} />
          ) : (
            <div className="detail-hero-fallback">
              {decodedName.split(" ").map((w) => w[0]).join("")}
            </div>
          )}
        </div>
        <div className="detail-hero-info">
          <span className="detail-hero-number mono">{driverInfo.number}</span>
          <h1>{decodedName}</h1>
          <p className="detail-hero-meta">
            <FlagIcon code={driverInfo.nationality} size={18} /> · {teamInfo.name}
          </p>
        </div>
      </div>

      {bio && (
        <div className="summary-card" style={{ marginBottom: "2rem" }}>
          <span className="summary-eyebrow">ABOUT</span>
          <p className="summary-text">{bio}</p>
        </div>
      )}

      <h2 className="f1-section-title">LAST 5 SEASONS</h2>

{loading && <Spinner label="Loading season history..." />}
      {!loading && history.length > 0 && (
        <section className="f1-timing-tower">
          <div className="f1-tower-header history-header">
            <span>YEAR</span>
            <span>POS</span>
            <span>POINTS</span>
            <span>WINS</span>
          </div>
          {history.map((h, i) => (
            <div className="f1-tower-row" key={i}>
              <div className="f1-row-skew history-row">
                <span className="mono">{h.year}</span>
                <span className="mono">P{h.position}</span>
                <span className="mono" style={{ color: "var(--f1-red)", fontWeight: 700 }}>
                  {h.points}
                </span>
                <span className="mono">{h.wins}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && history.length === 0 && (
        <p className="f1-loading-note">No historical standings data found for this driver.</p>
      )}
    </div>
  );
}

export default DriverDetail;