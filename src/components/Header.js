import React from "react";
import ScoreCard from "./ScoreCard";
import "./Header.css";

export default function Header({ score, bestScore }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1>2048</h1>
        <div className="score-container">
          <ScoreCard score={score} label="score" />
          <ScoreCard score={bestScore} label="best" />
        </div>
      </div>
    </header>
  );
}
