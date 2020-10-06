import React, { useEffect, useRef, useState } from "react";
import "./ScoreCard.css";

export default function ScoreCard({ label, score }) {
  const [displayScore, setDisplayScore] = useState(score);
  const [difference, setDifference] = useState(0);
  const addition = useRef(null);

  useEffect(() => {
    setDifference(score - displayScore);
    setDisplayScore(score);
  }, [score, displayScore]);

  useEffect(() => {
    if (difference <= 0) return;
    addition.current.textContent = `+${difference}`;
    addition.current.style.animation = "slide-off 0.5s ease-in";
    setTimeout(() => {
      addition.current.style.animation = "none";
      setDifference(0);
    }, 500);
  }, [difference]);

  return (
    <div className="score-card">
      <div className="score-label">{label}</div>
      {displayScore}
      <div ref={addition} className="score-addition" />
    </div>
  );
}
