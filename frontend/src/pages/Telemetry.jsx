import { useState, useEffect } from "react";
import {
  getEventSchedule,
  getSessionDrivers,
  getTelemetryComparison,
  getCoachingFeedback,
} from "../api/client";
import Dropdown from "../components/Dropdown";
import LineOverlayChart from "../components/LineOverlayChart";

const DRIVER1_COLOR = "#E10600";
const DRIVER2_COLOR = "#FFFFFF";

function Telemetry() {
  const [activeTab, setActiveTab] = useState("comparison");

  const [year, setYear] = useState(2024);
  const [gp, setGp] = useState("Monza");
  const [sessionType, setSessionType] = useState("R");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driver1, setDriver1] = useState("");
  const [driver2, setDriver2] = useState("");

  const [comparisonData, setComparisonData] = useState(null);
  const [coachData, setCoachData] = useState(null);
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
          setDriver1(res.drivers[0]);
          setDriver2(res.drivers[1]);
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
    setComparisonData(null);
    setCoachData(null);
    try {
      const [comparisonRes, coachRes] = await Promise.all([
        getTelemetryComparison(year, gp, sessionType, driver1, driver2),
        getCoachingFeedback(year, gp, sessionType, driver1, driver2),
      ]);
      setComparisonData(comparisonRes);
      setCoachData(coachRes);
    } catch (err) {
      setError("Could not load data for this pairing — this session may not have the requested telemetry.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toPoints = (telemetry, key) => telemetry.map((t) => ({ x: t.Distance, y: t[key] }));

  return (
    <div className="f1-page">
      <h2 className="f1-section-title">TELEMETRY</h2>
      <p className="predictor-disclaimer">
        One click runs both the telemetry comparison and AI coaching analysis — switch tabs below to view either.
      </p>

      <div className="telemetry-subtabs">
        <button
          className={`telemetry-subtab ${activeTab === "comparison" ? "active" : ""}`}
          onClick={() => setActiveTab("comparison")}
        >
          COMPARISON
        </button>
        <button
          className={`telemetry-subtab ${activeTab === "coach" ? "active" : ""}`}
          onClick={() => setActiveTab("coach")}
        >
          AI COACH
        </button>
      </div>

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

        <Dropdown label="DRIVER 1" options={drivers} value={driver1} onChange={setDriver1} disabled={driversLoading} />
        <Dropdown label="DRIVER 2" options={drivers} value={driver2} onChange={setDriver2} disabled={driversLoading} />

        <button className="f1-btn" onClick={handleAnalyze}>
          {loading ? "LOADING..." : "ANALYZE"}
        </button>
      </section>

      {error && <p className="f1-error">{error}</p>}
      {loading && <p className="f1-loading-note">Loading full telemetry and generating coaching feedback — this can take up to 30s.</p>}

      {activeTab === "comparison" && comparisonData && (
        <>
          <div className="summary-facts" style={{ marginBottom: "1.5rem" }}>
            <div className="fact-chip">
              <span className="fact-label">{comparisonData.driver1.code} — FASTEST LAP</span>
              <span className="fact-value mono">{comparisonData.driver1.lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">{comparisonData.driver2.code} — FASTEST LAP</span>
              <span className="fact-value mono">{comparisonData.driver2.lap_time}</span>
            </div>
          </div>

          <LineOverlayChart
            title="SPEED"
            yLabel="km/h"
            series={[
              { name: comparisonData.driver1.code, color: DRIVER1_COLOR, points: toPoints(comparisonData.driver1.telemetry, "Speed") },
              { name: comparisonData.driver2.code, color: DRIVER2_COLOR, points: toPoints(comparisonData.driver2.telemetry, "Speed") },
            ]}
          />
          <LineOverlayChart
            title="THROTTLE"
            yLabel="%"
            series={[
              { name: comparisonData.driver1.code, color: DRIVER1_COLOR, points: toPoints(comparisonData.driver1.telemetry, "Throttle") },
              { name: comparisonData.driver2.code, color: DRIVER2_COLOR, points: toPoints(comparisonData.driver2.telemetry, "Throttle") },
            ]}
          />
          <LineOverlayChart
            title="BRAKE"
            yLabel="0/1"
            series={[
              { name: comparisonData.driver1.code, color: DRIVER1_COLOR, points: toPoints(comparisonData.driver1.telemetry, "Brake") },
              { name: comparisonData.driver2.code, color: DRIVER2_COLOR, points: toPoints(comparisonData.driver2.telemetry, "Brake") },
            ]}
          />

          {comparisonData.delta_time.length > 0 && (
            <LineOverlayChart
              title={`DELTA TIME (${comparisonData.driver2.code} vs ${comparisonData.driver1.code})`}
              yLabel="sec"
              series={[
                {
                  name: "Delta",
                  color: "var(--f1-red)",
                  points: comparisonData.delta_time.map((d) => ({ x: d.distance, y: d.delta })),
                },
              ]}
            />
          )}
        </>
      )}

      {activeTab === "coach" && coachData && (
        <>
          <div className="summary-facts" style={{ marginBottom: "1.5rem" }}>
            <div className="fact-chip">
              <span className="fact-label">{coachData.facts.driver} LAP TIME</span>
              <span className="fact-value mono">{coachData.facts.driver_lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">{coachData.facts.reference_driver} LAP TIME (REFERENCE)</span>
              <span className="fact-value mono">{coachData.facts.reference_lap_time}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">TOP SPEED GAP</span>
              <span className="fact-value">
                {(coachData.facts.max_speed_driver - coachData.facts.max_speed_reference).toFixed(1)} km/h
              </span>
            </div>
          </div>

          <div className="summary-card" style={{ marginBottom: "1.5rem" }}>
            <span className="summary-eyebrow">COACHING FEEDBACK</span>
            <div className="coach-feedback-text">
              {coachData.feedback.split("\n").filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <h2 className="f1-section-title">BRAKING ZONE COMPARISON</h2>
          <section className="f1-timing-tower">
            <div className="f1-tower-header coach-braking-header">
              <span>ZONE</span>
              <span>{coachData.facts.driver} (m)</span>
              <span>{coachData.facts.reference_driver} (m)</span>
              <span>DELTA</span>
            </div>
            {coachData.facts.braking_deltas.map((b, i) => (
              <div className="f1-tower-row" key={i}>
                <div className="f1-row-skew coach-braking-row">
                  <span className="mono">Z{b.zone}</span>
                  <span className="mono">{b.driver_distance}</span>
                  <span className="mono">{b.reference_distance}</span>
                  <span className="mono" style={{ color: b.delta_m > 0 ? "var(--f1-red)" : "#4ADE80", fontWeight: 700 }}>
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

export default Telemetry;