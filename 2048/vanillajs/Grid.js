const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
  #cells;

  /**
   * Constructs a new instance of the class.
   *
   * @param {HTMLElement} gridElement - The grid element to initialize.
   */
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.#cells = createCellElements(gridElement).map(
      (cellElement, index) =>
        new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
    );
  }

  get cells() {
    return this.#cells;
  }

  /**
   * Returns a grid of cells organized by column.
   *
   * @return {Array[]} A 2D array representing a grid of cells organized by column.
   */
  get cellsByColumn() {
    const cellGrid = [];
    for (const cell of this.#cells) {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
    }
    return cellGrid;
  }

  /**
   * Retrieves the cells organized by row.
   *
   * @return {Array[]} An array of arrays representing the cells organized by row.
   */
  get cellsByRow() {
    const cellGrid = [];
    for (const cell of this.#cells) {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
    }
    return cellGrid;
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  /**
   * Constructs a new instance of the class.
   *
   * @param {HTMLElement} cellElement - The element representing the cell.
   * @param {number} x - The x-coordinate of the cell.
   * @param {number} y - The y-coordinate of the cell.
   */
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  /**
   * Determines if the current tile can accept a new tile.
   *
   * @param {Tile} tile - The new tile to be checked.
   * @return {boolean} Returns true if the current tile is null or if the current tile's value is equal to the new tile's value. Otherwise, returns false.
   */
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  /**
   * Merges the merge tile with the current tile.
   */
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value += this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

/**
 * Generates an array of cell elements based on the provided grid element.
 *
 * @param {HTMLElement} gridElement - The grid element to create the cell elements for.
 * @return {Array<HTMLElement>} - An array of cell elements.
 */
function createCellElements(gridElement) {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
    return cell;
  });
  return cells;
}
