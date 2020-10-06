import React from "react";
import "./Overlay.css";

export default function Overlay({ display, title, subtitle }) {
  if (!display) return null;

  return (
    <div class="overlay">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
