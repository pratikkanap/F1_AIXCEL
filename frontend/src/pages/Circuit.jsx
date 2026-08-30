import { useState, useEffect } from "react";
import { getEventSchedule, getTrackMap } from "../api/client";
import TrackMap from "../components/TrackMap";
import Dropdown from "../components/Dropdown";

function Circuit() {
  const [year, setYear] = useState(2024);
  const [gp, setGp] = useState("Monza");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      try {
        const data = await getEventSchedule(year);
        setEvents(data.events);
        if (data.events.length > 0) setGp(data.events[0].EventName);
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
    setMapData(null);
    try {
      const data = await getTrackMap(year, gp, "R");
      setMapData(data);
    } catch (err) {
      setError("Could not load track map for that session.");
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
          {loading ? "LOADING..." : "LOAD TRACK MAP"}
        </button>
      </section>

      {error && <p className="f1-error">{error}</p>}
      {loading && <p className="f1-loading-note">Loading full telemetry — this can take up to 30s.</p>}

      {mapData && (
        <>
          <div className="track-map-container">
            <TrackMap trackPoints={mapData.track_points} corners={mapData.corners} />
          </div>

          <h2 className="f1-section-title" style={{ marginTop: "1.5rem" }}>CIRCUIT DETAILS</h2>
          <div className="circuit-details-grid">
            <div className="fact-chip">
              <span className="fact-label">CIRCUIT</span>
              <span className="fact-value">{mapData.details.circuit_name}</span>
              <span className="fact-sub">{mapData.details.country}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">TRACK LENGTH</span>
              <span className="fact-value">{mapData.details.track_length_km} km</span>
              <span className="fact-sub">{mapData.details.corner_count} corners</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">FASTEST LAP</span>
              <span className="fact-value mono">{mapData.details.fastest_lap_time}</span>
              <span className="fact-sub">{mapData.details.fastest_lap_driver}</span>
            </div>
            <div className="fact-chip">
              <span className="fact-label">EVENT DATE</span>
              <span className="fact-value">{mapData.details.event_date}</span>
            </div>
          </div>

          <h2 className="f1-section-title" style={{ marginTop: "2rem" }}>CORNERS</h2>
          <div className="corner-list-grid">
            {mapData.corners
              .sort((a, b) => a.Number - b.Number)
              .map((c, i) => (
                <div className="corner-chip mono" key={i}>
                  T{c.Number}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Circuit;