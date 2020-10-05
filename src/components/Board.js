import React from "react";
import "./Board.css";
import Tile from "./Tile";

export default function Board({ tiles }) {
  return (
    <div id="board">
      <div style={{ position: "relative" }}>
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
      <table id="board-background">
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {/* {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, valueIndex) => (
                <Tile value={value} key={valueIndex} />
              ))}
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
