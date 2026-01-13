/**
 * game.ts
 *
 * Core type definitions for the Clusters word puzzle game.
 * Separates static puzzle data (what we load) from runtime game state (what changes during play).
 */

// =============================================================================
// PUZZLE DATA TYPES (Static content loaded at game start)
// =============================================================================

/**
 * Difficulty rating 1-10, where 1 is easiest and 10 is hardest.
 * Used for color-coding solved categories and eventual leaderboard scoring.
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * A category is a group of 10 related items players must identify.
 * The name is hidden until all 10 items are successfully clustered.
 */
export interface Category {
    id: string;
    name: string;
    items: string[];
    difficulty: Difficulty;
}

/**
 * A complete puzzle containing exactly 10 categories (100 total items).
 * Puzzles are organized by month for content rotation.
 */
export interface Puzzle {
    id: string;
    month: string; // Format: "2026-01"
    categories: Category[];
}

// =============================================================================
// GAME STATE TYPES (Runtime state that changes during gameplay)
// =============================================================================

/**
 * A square on the game grid. Starts as a single item, grows via merging.
 *
 * Key invariant: All items in a GridSquare belong to the same category.
 * This is enforced by merge validation — cross-category merges are rejected
 * with a shake animation and counted as mistakes.
 */
export interface GridSquare {
    id: string;
    items: string[];
    categoryId: string;
    isSolved: boolean; // True when items.length === 10
}

/**
 * Complete game state for a puzzle in progress.
 * Grid shrinks from 100 squares → 10 as players merge successfully.
 */
export interface GameState {
    puzzleId: string;
    grid: GridSquare[];
    mistakes: number;
    solvedCategoryIds: string[];
    status: 'playing' | 'won';
    startTime: number; // Unix timestamp
    endTime?: number; // Set when status becomes 'won'
}

// =============================================================================
// INTERACTION TYPES (UI state for merge flow)
// =============================================================================

/**
 * Tracks which grid squares are currently selected.
 * Users select exactly 2 squares to attempt a merge.
 * Max length of 2 is enforced at runtime in useGameState.
 */
export type SelectedSquareIds = string[];

/**
 * Result of attempting to merge two selected squares.
 * Used to trigger appropriate UI feedback (merge animation vs shake).
 */
export type MergeResult =
    | { success: true; mergedSquare: GridSquare; solvedCategory?: Category }
    | { success: false; reason: 'different-categories' };