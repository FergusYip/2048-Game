import React, { useEffect, useRef } from "react";
import "./Overlay.css";

export default function Overlay({ display, title, subtitle, onClick }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.opacity = 1;
    overlayRef.current.style.backdropFilter = "blur(5px)";
    overlayRef.current.style.transition = "all 0.3s ease-in";
  });

  if (!display) return null;
  return (
    <div
      ref={overlayRef}
      style={{ opacity: 0, backdropFilter: "none" }}
      className="overlay"
      onClick={onClick}
    >
      <div className="overlay-background"></div>
      <div className="overlay-contents">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
