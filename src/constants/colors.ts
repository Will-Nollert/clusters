/**
 * colors.ts
 *
 * Color palette for the Clusters game.
 * Difficulty colors form a gradient from easy (cool) to hard (warm).
 */

// =============================================================================
// BASE PALETTE
// =============================================================================

export const COLORS = {
    // Core UI
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceLight: '#1f3460',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    textMuted: '#606060',

    // Interactive states
    selected: '#4a90d9',
    selectedBorder: '#6bb3ff',

    // Feedback
    error: '#e74c3c',
    success: '#2ecc71',

    // Grid squares (unsolved)
    squareDefault: '#2d3a5a',
    squareBorder: '#3d4a6a',
} as const;

// =============================================================================
// DIFFICULTY COLORS
// =============================================================================

/**
 * Color gradient for solved categories, indexed by difficulty (1-10).
 * Progression: Green → Yellow → Orange → Red → Purple
 * Index 0 is unused (difficulties are 1-based).
 */
export const DIFFICULTY_COLORS: Record<number, string> = {
    1: '#2ecc71',  // Emerald green (easiest)
    2: '#58d68d',  // Light green
    3: '#82e0aa',  // Pale green
    4: '#f4d03f',  // Yellow
    5: '#f5b041',  // Light orange
    6: '#eb984e',  // Orange
    7: '#e67e22',  // Dark orange
    8: '#e74c3c',  // Red
    9: '#c0392b',  // Dark red
    10: '#8e44ad', // Purple (hardest)
} as const;

/**
 * Get the color for a solved category based on its difficulty.
 * Falls back to default square color if difficulty is invalid.
 */
export const getDifficultyColor = (difficulty: number): string => {
    return DIFFICULTY_COLORS[difficulty] ?? COLORS.squareDefault;
};