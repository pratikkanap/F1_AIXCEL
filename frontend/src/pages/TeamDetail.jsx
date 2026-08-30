import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getConstructorStandings, getPersonBio } from "../api/client";
import teamsData from "../data/teamsData";
import DriverAvatar from "../components/DriverAvatar";
import PrincipalAvatar from "../components/PrincipalAvatar";
import TeamLogo from "../components/TeamLogo";
import Spinner from "../components/Spinner";

const HISTORY_YEARS = [2022, 2023, 2024, 2025, 2026];

function TeamDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [history, setHistory] = useState([]);
  const [principalBio, setPrincipalBio] = useState(null);
  const [loading, setLoading] = useState(true);

  const team = teamsData.find((t) => t.name === decodedName);

  useEffect(() => {
    if (!team) return;

    Promise.all(
      HISTORY_YEARS.map((year) =>
        getConstructorStandings(year)
          .then((data) => {
            const match = data.standings.find((s) =>
              s.constructorName.toLowerCase().includes(team.name.toLowerCase()) ||
              team.name.toLowerCase().includes(s.constructorName.toLowerCase())
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

    getPersonBio(team.principal).then((data) => setPrincipalBio(data.bio));
  }, [team]);

  if (!team) {
    return (
      <div className="f1-page">
        <p className="f1-error">Team not found.</p>
        <Link to="/teams" className="f1-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
          BACK TO TEAMS
        </Link>
      </div>
    );
  }

  return (
    <div className="f1-page" style={{ "--team-color": team.color }}>
      <Link to="/teams" className="back-link">← All teams</Link>

      <div className="detail-hero" style={{ "--team-color": team.color }}>
        <TeamLogo teamName={team.name} color={team.color} />
        <div className="detail-hero-info">
          <h1>{team.name}</h1>
          <p className="detail-hero-meta">Team Principal: {team.principal}</p>
        </div>
      </div>

      {principalBio && (
        <div className="summary-card" style={{ marginBottom: "2rem" }}>
          <span className="summary-eyebrow">ABOUT {team.principal.toUpperCase()}</span>
          <p className="summary-text">{principalBio}</p>
        </div>
      )}

      <h2 className="f1-section-title">LAST 5 SEASONS</h2>

{loading && <Spinner label="Loading season history..." />}
      {!loading && history.length > 0 && (
        <section className="f1-timing-tower" style={{ marginBottom: "2rem" }}>
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
        <p className="f1-loading-note" style={{ marginBottom: "2rem" }}>
          No historical standings data found for this team.
        </p>
      )}

      <h2 className="f1-section-title">DRIVERS</h2>
      <div className="team-drivers-row" style={{ maxWidth: "500px" }}>
        {team.drivers.map((d, i) => (
          <DriverAvatar
            key={i}
            name={d.name}
            number={d.number}
            color={team.color}
            nationality={d.nationality}
            teamName={team.name}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamDetail;