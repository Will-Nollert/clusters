/**
 * gameConfig.ts
 *
 * Core game rules and configuration values.
 * Centralized here so game balance can be tweaked without hunting through components.
 */

// =============================================================================
// PUZZLE STRUCTURE
// =============================================================================

/** Number of categories in each puzzle */
export const CATEGORIES_PER_PUZZLE = 10;

/** Number of items in each category */
export const ITEMS_PER_CATEGORY = 10;

/** Total items on the grid at game start (10 × 10) */
export const TOTAL_ITEMS = CATEGORIES_PER_PUZZLE * ITEMS_PER_CATEGORY;

// =============================================================================
// GRID LAYOUT
// =============================================================================

/** Number of columns in the game grid */
export const GRID_COLUMNS = 5;

/** 
 * Base cell size in pixels. 
 * Actual size computed dynamically based on screen width.
 * With 5 columns on ~390pt screen, each cell is ~70pt.
 */
export const MIN_CELL_SIZE = 60;

/** Spacing between grid cells in pixels */
export const GRID_GAP = 6;

/** Padding inside cluster cells */
export const CLUSTER_PADDING = 6;

/** Height of individual item pills inside clusters */
export const PILL_HEIGHT = 24;

// =============================================================================
// INTERACTION TIMING
// =============================================================================

/** How long the shake animation plays on failed merge (ms) */
export const SHAKE_DURATION_MS = 400;

/** How long the merge animation takes (ms) */
export const MERGE_ANIMATION_MS = 200;

/** How long to show category reveal before continuing (ms) */
export const CATEGORY_REVEAL_MS = 1500;

/** Duration for long-press to trigger cluster preview (ms) */
export const LONG_PRESS_DURATION_MS = 300;

// =============================================================================
// SELECTION
// =============================================================================

/** Maximum squares that can be selected at once */
export const MAX_SELECTION = 2;