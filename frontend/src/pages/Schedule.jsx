import { useState, useEffect } from "react";
import { getEventSchedule } from "../api/client";

// Simple mapping of country → circuit image (you can expand this)
const circuitImages = {
  Bahrain: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain.png",
  "Saudi Arabia": "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia.png",
  Australia: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia.png",
  Japan: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan.png",
  China: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China.png",
  Miami: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami.png",
  Monaco: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Monaco.png",
  Spain: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain.png",
  Canada: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada.png",
  Austria: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria.png",
  "Great Britain": "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain.png",
  Hungary: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary.png",
  Belgium: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Belgium.png",
  Netherlands: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands.png",
  Italy: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Italy.png",
  Azerbaijan: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan.png",
  Singapore: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Singapore.png",
  "United States": "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States.png",
  Mexico: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Mexico.png",
  Brazil: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil.png",
  "Las Vegas": "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Las%20Vegas.png",
  Qatar: "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Qatar.png",
  "Abu Dhabi": "https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Abu%20Dhabi.png",
};

function Schedule() {
  const [year, setYear] = useState(2026);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await getEventSchedule(year);
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [year]);

  const formatDateRange = (start, end) => {
    if (!start) return "";
    const options = { day: "2-digit", month: "short" };
    const s = new Date(start).toLocaleDateString("en-GB", options).toUpperCase();
    if (!end) return s;
    const e = new Date(end).toLocaleDateString("en-GB", options).toUpperCase();
    return `${s} - ${e}`;
  };

  const getCircuitImage = (country) => {
    if (!country) return null;
    // Try exact match first, then partial match
    return (
      circuitImages[country] ||
      Object.entries(circuitImages).find(([key]) =>
        country.toLowerCase().includes(key.toLowerCase())
      )?.[1] ||
      null
    );
  };

  return (
    <div className="f1-page">
      <section className="f1-filters">
       <div className="f1-input-group">
  <label>SEASON</label>
  <select
    className="schedule-season-select"
    value={year}
    onChange={(e) => setYear(Number(e.target.value))}
  >
    {[2026, 2025, 2024, 2023, 2022].map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))}
  </select>
</div>
        <button className="f1-btn" onClick={loadSchedule}>
          {loading ? "LOADING..." : "GET CALENDAR"}
        </button>
      </section>

      {loading && <p className="f1-loading">Loading schedule...</p>}

      <div className="schedule-grid">
        {events.map((ev) => {
          const imageUrl = getCircuitImage(ev.Country || ev.Location);

          return (
            <div className="schedule-card" key={ev.RoundNumber || ev.EventName}>
              <div className="schedule-card-top">
                <div className="schedule-card-info">
                  <span className="schedule-round">
                    {ev.RoundNumber ? `ROUND ${ev.RoundNumber}` : "TESTING"}
                  </span>

                  <h3 className="schedule-country">
                    {ev.Country || ev.Location || "TBC"}
                  </h3>

                  <p className="schedule-event-name">
                    {ev.EventName || ev.OfficialEventName}
                  </p>
                </div>

                {/* Venue / Circuit Image */}
                {imageUrl && (
                  <div className="schedule-card-image">
                    <img
                      src={imageUrl}
                      alt={ev.Country || "Circuit"}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              <div className="schedule-date">
                {formatDateRange(
                  ev.EventDate || ev.Session1Date,
                  ev.EventEndDate
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Schedule;