import React, { useEffect, useState } from 'react';
import './Board.css';
import Tile from './Tile';

export default function Board({ tiles }) {
  const [updateTiles, setUpdateTiles] = useState(false);

  useEffect(() => {
    window.onresize = () => {
      setUpdateTiles(true);
    };
    return () => {
      window.onresize = null;
    };
  }, []);

  const handleUpdate = () => {
    setUpdateTiles(false);
  };

  return (
    <div id="board">
      <div style={{ position: 'relative' }}>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            update={updateTiles}
            onUpdate={handleUpdate}
          />
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
