import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPersonImage } from "../api/client";
import FlagIcon from "./FlagIcon";

function DriverAvatar({ name, number, color, nationality, teamName }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  useEffect(() => {
    let cancelled = false;
    getPersonImage(name)
      .then((data) => {
        if (!cancelled && data.image_url) setImageUrl(data.image_url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <Link
      to={`/driver/${encodeURIComponent(name)}`}
      className="driver-card"
      style={{ "--team-color": color }}
    >
      <div className="driver-card-texture" />

      <div className="driver-card-text">
        <div className="driver-card-top">
          <span className="driver-card-first">{firstName}</span>
          <span className="driver-card-last">{lastName}</span>
          <span className="driver-card-team">{teamName}</span>
        </div>
        <div className="driver-card-bottom-row">
          <span className="driver-card-number mono">{number}</span>
          <FlagIcon code={nationality} />
        </div>
      </div>

      <div className="driver-card-photo">
        {imageUrl && !imageFailed ? (
          <img src={imageUrl} alt={name} onError={() => setImageFailed(true)} />
        ) : (
          <div className="driver-card-photo-fallback">
            {firstName[0]}
            {lastName[0]}
          </div>
        )}
      </div>
    </Link>
  );
}

export default DriverAvatar;