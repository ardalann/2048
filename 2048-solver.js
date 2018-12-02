/**
 * Settings
 */
const initOnLoad = true;
const maxInitAttempts = 100;
const delayBetweenMoves = 111150; // ms

/**
 * Variables and constants
 */
let initAttempts = 0;
const keyMappings = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40
};

/**
 * Functions
 */
const init = () => {
  const board = readBoard();

  if (!board) {
    initAttempts++;

    if (initAttempts < maxInitAttempts) {
      setTimeout(init, 0);
    } else {
      console.log("Could not initialize");
    }
  } else {
    play(board);
  }
};

const play = board => {
  const nextMove = getNextMove(board);
  simulate(keyMappings[nextMove]);

  setTimeout(() => play(readBoard()), delayBetweenMoves);
};

const readBoard = () => {
  const tiles = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const tileNodes = Array.from(document.querySelectorAll(".tile"));

  if (tileNodes.length === 0) {
    return null;
  }

  tileNodes.forEach(node => {
    const position = Array.from(node.classList)
      .find(className => className.indexOf("tile-position-") === 0)
      .replace("tile-position-", "")
      .split("-")
      .map(str => parseInt(str, 10) - 1);
    tiles[position[1]][position[0]] = parseInt(node.textContent, 10);
  });

  return tiles;
};

const getNextMove = board => {
  const possibleMoves = getPossibleMoves(board);
  console.log("possibleMoves", possibleMoves);

  return "ArrowLeft";
};

const findLastIndex = (arr, callback) => {
  const reverseIndex = arr
    .slice()
    .reverse()
    .findIndex(callback);

  if (reverseIndex === -1) {
    return -1;
  }

  return (arr.length - reverseIndex - 1) % arr.length;
};

const getColumns = board => {
  const columns = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  board.forEach((row, rowIndex) =>
    row.forEach((num, colIndex) => {
      columns[colIndex][rowIndex] = num;
    })
  );

  return columns;
};

const isArrowLeftPossible = board =>
  board.some(row => {
    const firstEmptyTileIndex = row.findIndex(num => num === 0);
    const lastNonEmptyTileIndex = findLastIndex(row, num => num > 0);

    return (
      firstEmptyTileIndex > -1 && firstEmptyTileIndex < lastNonEmptyTileIndex
    );
  });

const isArrowRightPossible = board =>
  board.some(row => {
    const firstNonEmptyTileIndex = row.findIndex(num => num > 0);
    const lastEmptyTileIndex = findLastIndex(row, num => num === 0);

    return (
      firstNonEmptyTileIndex > -1 && firstNonEmptyTileIndex < lastEmptyTileIndex
    );
  });

const getPossibleMoves = board => {
  console.log("getPossibleMoves", board);
  const possibleMoves = [];

  if (isArrowLeftPossible(board)) {
    possibleMoves.push("ArrowLeft");
  }

  if (isArrowRightPossible(board)) {
    possibleMoves.push("ArrowRight");
  }

  const columns = getColumns(board);

  if (isArrowLeftPossible(columns)) {
    possibleMoves.push("ArrowUp");
  }

  if (isArrowRightPossible(columns)) {
    possibleMoves.push("ArrowDown");
  }

  return possibleMoves;
};

const simulate = keyCode => {
  document.body.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      keyCode
    })
  );
};

/**
 * Initialize
 */
if (initOnLoad) {
  document.addEventListener("DOMContentLoaded", init);
}
