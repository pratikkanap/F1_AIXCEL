import { useState, useEffect } from "react";
import { getPersonImage } from "../api/client";

function PrincipalAvatar({ name, color }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

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
    <div className="principal-avatar" style={{ "--team-color": color }}>
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={name}
          className="principal-avatar-photo"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="principal-avatar-badge">{initials}</div>
      )}
    </div>
  );
}

export default PrincipalAvatar;