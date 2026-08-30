import { Link } from "react-router-dom";
import teamsData from "../data/teamsData";
import DriverAvatar from "../components/DriverAvatar";
import PrincipalAvatar from "../components/PrincipalAvatar";
import TeamLogo from "../components/TeamLogo";

function Teams() {
  return (
    <div className="f1-page">
      <h2 className="f1-section-title">2026 TEAMS & DRIVERS</h2>
    
<p className="predictor-disclaimer">
  "The winner ain't the one with the fastest car, it's the one who refuses to give up."
</p>
      <div className="teams-grid">
        {teamsData.map((team, i) => (
          <div className="team-card" key={i} style={{ "--team-color": team.color }}>
            <div className="team-card-header">
              <div className="team-card-title-row">
                <Link to={`/team/${encodeURIComponent(team.name)}`} className="team-card-link">
                  <h3>{team.name}</h3>
                </Link>
              </div>

              <div className="team-principal-row">
                <div>
                  <span className="team-principal-label">TEAM PRINCIPAL</span>
                  <span className="team-principal-name">{team.principal}</span>
                </div>
              </div>
            </div>

            <div className="team-drivers-row">
              {team.drivers.map((d, j) => (
                <DriverAvatar
                  key={j}
                  name={d.name}
                  number={d.number}
                  color={team.color}
                  nationality={d.nationality}
                  teamName={team.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;