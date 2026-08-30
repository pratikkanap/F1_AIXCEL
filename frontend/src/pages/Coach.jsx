import { useState, useEffect } from "react";
import { getEventSchedule, getSessionDrivers, getCoachingFeedback } from "../api/client";
import Dropdown from "../components/Dropdown";

function Coach() {
  const [year, setYear] = useState(2024);
  const [gp, setGp] = useState("Monza");
  const [sessionType, setSessionType] = useState("R");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driver, setDriver] = useState("");
  const [referenceDriver, setReferenceDriver] = useState("");
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

  useEffect(() => {
    const loadDrivers = async () => {
      if (!gp) return;
      setDriversLoading(true);
      try {
        const res = await getSessionDrivers(year, gp, sessionType);
        setDrivers(res.drivers);
        if (res.drivers.length > 1) {
          setDriver(res.drivers[0]);
          setReferenceDriver(res.drivers[1]);
        }
      } catch (err) {
        console.error(err);
        setDrivers([]);
      } finally {
        setDriversLoading(false);
      }
    };
    loadDrivers();
  }, [year, gp, sessionType]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await getCoachingFeedback(year, gp, sessionType, driver, referenceDriver);
      setData(res);
    } catch (err) {
      setError("Could not generate coaching feedback for this pairing.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="f1-page">
      <h2 className="f1-section-title">AI DRIVER COACH</h2>
      <p className="predictor-disclaimer">
        Compares a driver's fastest lap against a reference driver's fastest lap and turns the telemetry gap into specific coaching feedback.
      </p>

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

        <Dropdown
          label="SESSION"
          options={[
            { label: "RACE", value: "R" },
            { label: "QUALIFYING", value: "Q" },
          ]}
          value={sessionType}
          onChange={setSessionType}
        />

        <Dropdown
          label="DRIVER"
          options={drivers}
          value={driver}
          onChange={setDriver}
          disabled={driversLoading}
        />

        <Dropdown
          label="REFERENCE"
          options={drivers}
          value={referenceDriver}
          onChange={setReferenceDriver}
          disabled={driversLoading}
        />

        <button className="f1-btn" onClick={handleAnalyze}>
          {loading ? "ANALYZING..." : "GET COACHING"}
        </button>
      </section>

      {error && <p className="f1-error">{error}</p>}
      {loading && <p className="f1-loading-note">Loading telemetry for both drivers and generating feedback...</p>}

      {data && (
        <>
          <div className="summary-facts" style={{ marginBottom: "1.5rem" }}>
            <div className="fact-chip">
              <span className="fact-label">{data.facts.driver} LAP TIME</span>
              <span className="fact-value mono">{data.facts.driver_lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">{data.facts.reference_driver} LAP TIME (REFERENCE)</span>
              <span className="fact-value mono">{data.facts.reference_lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">TOP SPEED GAP</span>
              <span className="fact-value">
                {(data.facts.max_speed_driver - data.facts.max_speed_reference).toFixed(1)} km/h
              </span>
            </div>
          </div>

          <div className="summary-card" style={{ marginBottom: "1.5rem" }}>
            <span className="summary-eyebrow">COACHING FEEDBACK</span>
            <div className="coach-feedback-text">
              {data.feedback.split("\n").filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <h2 className="f1-section-title">BRAKING ZONE COMPARISON</h2>
          <section className="f1-timing-tower">
            <div className="f1-tower-header coach-braking-header">
              <span>ZONE</span>
              <span>{data.facts.driver} (m)</span>
              <span>{data.facts.reference_driver} (m)</span>
              <span>DELTA</span>
            </div>
            {data.facts.braking_deltas.map((b, i) => (
              <div className="f1-tower-row" key={i}>
                <div className="f1-row-skew coach-braking-row">
                  <span className="mono">Z{b.zone}</span>
                  <span className="mono">{b.driver_distance}</span>
                  <span className="mono">{b.reference_distance}</span>
                  <span
                    className="mono"
                    style={{ color: b.delta_m > 0 ? "var(--f1-red)" : "#4ADE80", fontWeight: 700 }}
                  >
                    {b.delta_m > 0 ? "+" : ""}
                    {b.delta_m}m
                  </span>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default Coach;