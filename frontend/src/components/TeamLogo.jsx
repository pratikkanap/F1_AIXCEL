import { useState, useEffect } from "react";
import { getPageImage } from "../api/client";

function TeamLogo({ teamName, color }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
getPageImage(teamName)      .then((data) => {
        if (!cancelled && data.image_url) setImageUrl(data.image_url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [teamName]);

  const initials = teamName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={`${teamName} logo`}
        className="team-logo-img"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="team-logo-fallback" style={{ background: color }}>
      {initials}
    </div>
  );
}

export default TeamLogo;