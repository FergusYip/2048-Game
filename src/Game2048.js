const GRID_SIZE = 4;

export const GAME_STATES = {
  WIN: 'WIN',
  LOSS: 'LOSS',
  PLAYING: 'PLAYING',
};
Object.freeze(GAME_STATES);

export const INITIAL_STATE = {
  tiles: [],
  state: GAME_STATES.PLAYING,
  keepPlaying: false,
  score: 0,
};
Object.freeze(INITIAL_STATE);

const getRandomInt = (max) => Math.floor(Math.random() * Math.ceil(max));
const newId = () => getRandomInt(10 ** 10);
const twoOrFour = () => ((getRandomInt(10) % 2) + 1) * 2;

export const newTile = (value, x, y) => {
  return {
    id: newId(),
    value,
    x,
    y,
    hidden: false,
  };
};

export const newGame = () => ({
  ...INITIAL_STATE,
  tiles: [
    newTile(2, getRandomInt(4), getRandomInt(4)),
    newTile(2, getRandomInt(4), getRandomInt(4)),
  ],
});

export function getRowTiles(tiles, rowIndex) {
  return tiles.filter((tile) => tile.y === rowIndex);
}

export function getColumnTiles(tiles, columnIndex) {
  return tiles.filter((tile) => tile.x === columnIndex);
}

function shiftTilesLeft(tiles, axis, reverse) {
  tiles = tiles.filter((tile) => !tile.hidden);
  tiles = reverse ? tiles.reverse() : tiles;
  const sortedTiles = tiles.sort(
    (a, b) => (a[axis] - b[axis]) * (reverse ? -1 : 1)
  );
  let result = [];
  let hidden = [];
  let score = 0;
  for (let i = 0; i < sortedTiles.length; i++) {
    if (
      i < sortedTiles.length - 1 &&
      sortedTiles[i].value === sortedTiles[i + 1].value
    ) {
      let { value, x, y } = sortedTiles[i];
      let merged = newTile(value * 2, x, y);
      result.push(merged);
      hidden.push({ ...sortedTiles[i], hidden: true, sameIndexAs: merged.id });
      hidden.push({
        ...sortedTiles[i + 1],
        hidden: true,
        sameIndexAs: merged.id,
      });
      score += value * 2;
      i++;
    } else {
      result.push(sortedTiles[i]);
    }
  }
  let ordered = result.map((tile, index) => ({
    ...tile,
    [axis]: reverse ? GRID_SIZE - 1 - index : index,
  }));

  hidden.forEach((tile) => {
    ordered.push({
      ...tile,
      [axis]: ordered.find((t) => t.id === tile.sameIndexAs)[axis],
    });
  });
  return { tiles: ordered, score };
}

export function nextUpState(gameState) {
  let columns = [...Array(GRID_SIZE)].map(() => []);
  for (const tile of gameState.tiles) {
    columns[tile.x].push(tile);
  }

  let nextState = { ...gameState, tiles: [] };
  for (const column of columns) {
    const { tiles, score } = shiftTilesLeft(column, 'y', false);
    nextState.tiles.push(...tiles);
    nextState.score += score;
  }
  return nextState;
}

export function nextDownState(gameState) {
  let columns = [...Array(GRID_SIZE)].map(() => []);
  for (const tile of gameState.tiles) {
    columns[tile.x].push(tile);
  }

  let nextState = { ...gameState, tiles: [] };
  for (const column of columns) {
    const { tiles, score } = shiftTilesLeft(column, 'y', true);
    nextState.tiles.push(...tiles);
    nextState.score += score;
  }
  return nextState;
}

export function nextLeftState(gameState) {
  let rows = [...Array(GRID_SIZE)].map(() => []);
  for (const tile of gameState.tiles) {
    rows[tile.y].push(tile);
  }

  let nextState = { ...gameState, tiles: [] };
  for (const row of rows) {
    const { tiles, score } = shiftTilesLeft(row, 'x', false);
    nextState.tiles.push(...tiles);
    nextState.score += score;
  }
  return nextState;
}

export function nextRightState(gameState) {
  let rows = [...Array(GRID_SIZE)].map(() => []);
  for (const tile of gameState.tiles) {
    rows[tile.y].push(tile);
  }

  let nextState = { ...gameState, tiles: [] };
  for (const row of rows) {
    const { tiles, score } = shiftTilesLeft(row, 'x', true);
    nextState.tiles.push(...tiles);
    nextState.score += score;
  }
  return nextState;
}

export function isSameState(gameState, otherGameState) {
  let tiles = gameState.tiles.filter((tile) => !tile.hidden);
  let otherTiles = otherGameState.tiles.filter((tile) => !tile.hidden);

  if (tiles.length !== otherTiles.length) {
    return false;
  }

  for (const tile of tiles) {
    if (
      !otherTiles.find(
        (otherTile) =>
          otherTile.x === tile.x &&
          otherTile.y === tile.y &&
          otherTile.value === tile.value &&
          otherTile.id === tile.id
      )
    ) {
      return false;
    }
  }
  return true;
}

export function isGameOver(gameState) {
  const nextStates = [
    nextUpState(gameState),
    nextLeftState(gameState),
    nextRightState(gameState),
    nextRightState(gameState),
  ];
  return nextStates.every((state) => isSameState(gameState, state));
}

export function isVictory(gameState) {
  const { tiles } = gameState;
  return tiles.some((tile) => tile.value === 2048);
}

export function checkState(gameState) {
  return isGameOver(gameState)
    ? GAME_STATES.LOSS
    : isVictory(gameState)
    ? GAME_STATES.WIN
    : GAME_STATES.PLAYING;
}

export function updateState(gameState) {
  return { ...gameState, state: checkState(gameState) };
}

export function insertRandom(gameState) {
  let nextState = { ...gameState };
  let matrix = [];
  nextState.tiles.forEach((tile) => {
    if (!matrix[tile.y]) {
      matrix[tile.y] = [];
    }
    matrix[tile.y][tile.x] = tile.value;
  });

  let possible = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (!matrix[y] || !matrix[y][x]) {
        possible.push({ x, y });
      }
    }
  }
  if (possible.length !== 0) {
    let insertTo = possible[getRandomInt(possible.length - 1)];
    nextState.tiles = [
      ...nextState.tiles,
      newTile(twoOrFour(), insertTo.x, insertTo.y),
    ];
  }
  return nextState;
}

export default {
  nextUpState,
  nextDownState,
  nextRightState,
  nextLeftState,
  insertRandom,
  checkState,
  newGame,
};
