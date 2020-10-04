import React, { useRef, useEffect, useState } from 'react';
import './Tile.css';

export default function Tile({ tile, update, onUpdate }) {
  const tileRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isFirst, setIsFirst] = useState(true);

  // First render
  useEffect(() => {
    if (tileRef === null) return;
    if (!isFirst) return;
    let tempOffset = tileRef.current.clientWidth * 1.2;
    setOffset(tempOffset);
    tileRef.current.style.top = `${tile.y * tempOffset}px`;
    tileRef.current.style.left = `${tile.x * tempOffset}px`;

    tileRef.current.style.transform = 'scale(1)';
    tileRef.current.style.opacity = 1;
    tileRef.current.style.transition = 'all 200ms';
    setIsFirst(false);
  }, [tile, tileRef, isFirst]);

  // Hide tile if hidden
  useEffect(() => {
    if (tile.hidden) {
      try {
        tileRef.current.style.opacity = 0;
      } catch (e) {}
    }
  }, [tileRef, tile]);

  useEffect(() => {
    if (isFirst) return;
    tileRef.current.style.top = `${tile.y * offset}px`;
    tileRef.current.style.left = `${tile.x * offset}px`;
    tileRef.current.style.transition = 'all 0.1s';
  }, [tile, isFirst, offset]);

  useEffect(() => {
    if (update) {
      setOffset(tileRef.current.clientWidth * 1.2);
      onUpdate();
    }
  }, [update, onUpdate]);

  return (
    <div
      ref={tileRef}
      className={`tile tile-${tile.value}`}
      style={{
        position: 'absolute',
        transform: 'scale(0.3)',
        opacity: 0,
      }}
    >
      {tile.value}
    </div>
  );
}
