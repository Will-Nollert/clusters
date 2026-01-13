/**
 * gridLayout.ts
 *
 * Fluid row-fill layout algorithm for the adaptive cluster grid.
 * 
 * Key behavior:
 * - 5 columns per row (100 items = 20 rows initially)
 * - Items packed into rows, each row targets ~5 "item units"
 * - Each item's width is proportional to its item count within that row
 * - No empty spaces — rows always fill full width
 * - Example: 4-item cluster + 1 single = two rectangles, 80% and 20% width
 */

import { GridSquare } from '../types/game';

// =============================================================================
// TYPES
// =============================================================================

/**
 * A row of items where widths are proportional to item counts.
 */
export interface LayoutRow {
  squares: GridSquare[];
  /** Sum of all items in this row (used for proportional width calc) */
  totalItems: number;
}

/**
 * Positioned item within a row, ready for rendering.
 */
export interface LayoutItem {
  square: GridSquare;
  /** Which row this item is in (0-based) */
  rowIndex: number;
  /** Fraction of row width (0-1) this item occupies */
  widthFraction: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Target number of "item units" per row.
 * With 5 items per row and 100 total items, we get 20 rows initially.
 * As items merge, rows consolidate naturally.
 */
const TARGET_ITEMS_PER_ROW = 5;

/**
 * Maximum items allowed in a single row.
 * Prevents one huge cluster from creating very tall rows.
 */
const MAX_ITEMS_PER_ROW = 10;

// =============================================================================
// LAYOUT CALCULATION
// =============================================================================

/**
 * Packs squares into rows using a greedy bin-packing approach.
 * Larger clusters are placed first for better packing.
 * 
 * @param squares - Unsolved grid squares to layout
 * @returns Array of rows, each containing squares and their total item count
 */
export const packIntoRows = (squares: GridSquare[]): LayoutRow[] => {
  if (squares.length === 0) return [];

  // Sort by size descending (larger clusters first = better packing)
  const sorted = [...squares].sort((a, b) => b.items.length - a.items.length);

  const rows: LayoutRow[] = [];
  let currentSquares: GridSquare[] = [];
  let currentTotal = 0;

  for (const square of sorted) {
    const itemCount = square.items.length;

    // Check if adding this square would exceed our row target
    const wouldExceed = currentTotal + itemCount > MAX_ITEMS_PER_ROW;
    const isAtTarget = currentTotal >= TARGET_ITEMS_PER_ROW;

    if ((wouldExceed || isAtTarget) && currentSquares.length > 0) {
      // Finalize current row and start new one
      rows.push({ squares: currentSquares, totalItems: currentTotal });
      currentSquares = [square];
      currentTotal = itemCount;
    } else {
      // Add to current row
      currentSquares.push(square);
      currentTotal += itemCount;
    }
  }

  // Don't forget the last row
  if (currentSquares.length > 0) {
    rows.push({ squares: currentSquares, totalItems: currentTotal });
  }

  return rows;
};

/**
 * Converts packed rows into positioned layout items.
 * Each item knows its row and width fraction.
 */
export const calculateLayout = (squares: GridSquare[]): LayoutItem[] => {
  const rows = packIntoRows(squares);
  const items: LayoutItem[] = [];

  rows.forEach((row, rowIndex) => {
    row.squares.forEach((square) => {
      items.push({
        square,
        rowIndex,
        widthFraction: square.items.length / row.totalItems,
      });
    });
  });

  return items;
};

/**
 * Get the total number of rows in the layout.
 */
export const getTotalRows = (squares: GridSquare[]): number => {
  return packIntoRows(squares).length;
};

/**
 * Filter to only unsolved squares (for grid display).
 */
export const getUnsolvedSquares = (squares: GridSquare[]): GridSquare[] => {
  return squares.filter((sq) => !sq.isSolved);
};

/**
 * Filter to only solved squares (for trophy display).
 */
export const getSolvedSquares = (squares: GridSquare[]): GridSquare[] => {
  return squares.filter((sq) => sq.isSolved);
};