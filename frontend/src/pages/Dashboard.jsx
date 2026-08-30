import { useState, useEffect } from "react";
import { getSessionResults, getEventSchedule } from "../api/client";
import Dropdown from "../components/Dropdown";

function Dashboard() {
  const [year, setYear] = useState(2024);
  const [gp, setGp] = useState("Monza");
  const [sessionType, setSessionType] = useState("R");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      try {
        const data = await getEventSchedule(year);
        setEvents(data.events);
        if (data.events.length > 0) setGp(data.events[0].EventName);
      } catch (err) {
        console.error("Failed to load events:", err);
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    loadEvents();
  }, [year]);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionResults(year, gp, sessionType);
      setResults(data.results);
    } catch (err) {
      setError("No data found. Check backend is running and the GP name is correct.");
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
          getLabel={(ev) => `${ev.EventName} — ${ev.Country}`}
          getValue={(ev) => ev.EventName}
        />

        <Dropdown
          label="SESSION"
          options={[
            { label: "RACE", value: "R" },
            { label: "QUALIFYING", value: "Q" },
            { label: "PRACTICE 1", value: "FP1" },
          ]}
          value={sessionType}
          onChange={setSessionType}
        />

        <button className="f1-btn" onClick={handleFetch}>
          {loading ? "LOADING..." : "GET RESULTS"}
        </button>
      </section>

      {error && <p className="f1-error">{error}</p>}

      {results.length > 0 && (
        <section className="f1-timing-tower">
          <div className="f1-tower-header">
            <span className="col-pos">POS</span>
            <span className="col-driver">DRIVER</span>
            <span className="col-team">TEAM</span>
            <span className="col-time">TIME</span>
            <span className="col-pts">PTS</span>
          </div>
          {results.map((r, i) => (
            <div className="f1-tower-row" key={i}>
              <div className="f1-row-skew">
                <span className="col-pos mono">{r.Position}</span>
                <span className="col-driver">{r.Abbreviation}</span>
                <span className="col-team">{r.TeamName}</span>
                <span className="col-time mono">{r.Time}</span>
                <span className="col-pts mono">{r.Points}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Dashboard;