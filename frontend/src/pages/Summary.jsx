import { useState, useEffect } from "react";
import { getEventSchedule, getRaceSummary } from "../api/client";
import Dropdown from "../components/Dropdown";

function Summary() {
  const [year, setYear] = useState(2024);
  const [gp, setGp] = useState("Monza");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      try {
        const res = await getEventSchedule(year);
        setEvents(res.events);
        if (res.events.length > 0) setGp(res.events[0].EventName);
      } catch (err) {
        console.error(err);
      } finally {
        setEventsLoading(false);
      }
    };
    loadEvents();
  }, [year]);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await getRaceSummary(year, gp, "R");
      setData(res);
    } catch (err) {
      setError("Could not generate a summary for that race.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="f1-page">
      <section className="f1-filters">
        <div className="f1-input-group">
          <label>SEASON</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <Dropdown
          label="GRAND PRIX"
          options={events}
          value={gp}
          onChange={setGp}
          disabled={eventsLoading}
          getLabel={(ev) => ev.EventName}
          getValue={(ev) => ev.EventName}
        />

        <button className="f1-btn" onClick={handleFetch}>
          {loading ? "GENERATING..." : "SUMMARISE RACE"}
        </button>
      </section>

      {error && <p className="f1-error">{error}</p>}
      {loading && <p className="f1-loading-note">Pulling race data and generating summary...</p>}

      {data && (
        <div className="summary-layout">
          <div className="summary-card">
            <span className="summary-eyebrow">RACE RECAP</span>
            <p className="summary-text">{data.summary}</p>
          </div>

          <div className="summary-facts">
            <div className="fact-chip">
              <span className="fact-label">WINNER</span>
              <span className="fact-value">{data.facts.winner}</span>
              <span className="fact-sub">{data.facts.winner_team}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">FASTEST LAP</span>
              <span className="fact-value">{data.facts.fastest_lap_driver}</span>
              <span className="fact-sub mono">{data.facts.fastest_lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">FINISHERS</span>
              <span className="fact-value">{data.facts.total_finishers}</span>
              <span className="fact-sub">
                {data.facts.retirements.length} retirement{data.facts.retirements.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="podium-row">
            {data.facts.podium.map((p, i) => (
              <div className={`podium-chip position-${i + 1}`} key={i}>
                <span className="podium-rank mono">P{i + 1}</span>
                <span className="podium-driver">{p.Abbreviation}</span>
                <span className="podium-team">{p.TeamName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;