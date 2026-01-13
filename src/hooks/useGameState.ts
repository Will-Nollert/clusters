/**
 * useGameState.ts
 *
 * Core game logic hook for Clusters. Manages the entire gameplay state machine:
 * - Grid initialization from puzzle data
 * - Square selection (max 2)
 * - Merge validation and execution
 * - Mistake tracking and win detection
 *
 * All game rules are enforced here, keeping components purely presentational.
 */

import { useState, useCallback, useMemo } from 'react';
import {
    Puzzle,
    Category,
    GridSquare,
    GameState,
    SelectedSquareIds,
    MergeResult,
} from '../types/game';
import { shuffleArray } from '../data/samplePuzzle';

// =============================================================================
// INITIALIZATION HELPERS
// =============================================================================

/**
 * Creates the initial 100-square grid from a puzzle.
 * Each item becomes its own GridSquare, then the grid is shuffled.
 */
const initializeGrid = (puzzle: Puzzle): GridSquare[] => {
    const squares: GridSquare[] = [];

    puzzle.categories.forEach((category) => {
        category.items.forEach((item, index) => {
            squares.push({
                id: `${category.id}-${index}`,
                items: [item],
                categoryId: category.id,
                isSolved: false,
            });
        });
    });

    return shuffleArray(squares);
};

/**
 * Creates the initial game state for a new game.
 */
const initializeGameState = (puzzle: Puzzle): GameState => ({
    puzzleId: puzzle.id,
    grid: initializeGrid(puzzle),
    mistakes: 0,
    solvedCategoryIds: [],
    status: 'playing',
    startTime: Date.now(),
});

// =============================================================================
// HOOK
// =============================================================================

interface UseGameStateReturn {
    // State
    gameState: GameState;
    selectedSquareIds: SelectedSquareIds;
    lastMergeResult: MergeResult | null;
    /** IDs of squares that should show shake animation (failed merge) */
    shakingSquareIds: string[];

    // Actions
    selectSquare: (squareId: string) => void;
    resetGame: () => void;
    clearSelection: () => void;
    /** Call after shake animation completes */
    clearShake: () => void;

    // Computed helpers
    isSquareSelected: (squareId: string) => boolean;
    getSquareById: (squareId: string) => GridSquare | undefined;
    getCategoryById: (categoryId: string) => Category | undefined;
}

export const useGameState = (puzzle: Puzzle): UseGameStateReturn => {
    const [gameState, setGameState] = useState<GameState>(() =>
        initializeGameState(puzzle)
    );
    const [selectedSquareIds, setSelectedSquareIds] = useState<SelectedSquareIds>([]);
    const [lastMergeResult, setLastMergeResult] = useState<MergeResult | null>(null);
    const [shakingSquareIds, setShakingSquareIds] = useState<string[]>([]);

    // ===========================================================================
    // COMPUTED HELPERS
    // ===========================================================================

    const isSquareSelected = useCallback(
        (squareId: string): boolean => {
            return selectedSquareIds.includes(squareId);
        },
        [selectedSquareIds]
    );

    const getSquareById = useCallback(
        (squareId: string): GridSquare | undefined => {
            return gameState.grid.find((sq) => sq.id === squareId);
        },
        [gameState.grid]
    );

    const getCategoryById = useCallback(
        (categoryId: string): Category | undefined => {
            return puzzle.categories.find((cat) => cat.id === categoryId);
        },
        [puzzle.categories]
    );

    // ===========================================================================
    // MERGE LOGIC
    // ===========================================================================

    /**
     * Attempts to merge two squares. Returns success/failure result.
     * On success: updates grid, checks for solved category and win condition.
     * On failure: increments mistake counter.
     */
    const attemptMerge = useCallback(
        (squareIdA: string, squareIdB: string): MergeResult => {
            const squareA = getSquareById(squareIdA);
            const squareB = getSquareById(squareIdB);

            // Safety check (shouldn't happen in normal flow)
            if (!squareA || !squareB) {
                return { success: false, reason: 'different-categories' };
            }

            // Validate: all items must be from the same category
            if (squareA.categoryId !== squareB.categoryId) {
                // Failed merge - increment mistakes
                setGameState((prev) => ({
                    ...prev,
                    mistakes: prev.mistakes + 1,
                }));
                return { success: false, reason: 'different-categories' };
            }

            // Success! Create merged square
            const mergedSquare: GridSquare = {
                id: squareA.id, // Keep first square's ID
                items: [...squareA.items, ...squareB.items],
                categoryId: squareA.categoryId,
                isSolved: squareA.items.length + squareB.items.length === 10,
            };

            // Update game state
            setGameState((prev) => {
                const newGrid = prev.grid
                    .filter((sq) => sq.id !== squareIdA && sq.id !== squareIdB)
                    .concat(mergedSquare);

                const newSolvedCategoryIds = mergedSquare.isSolved
                    ? [...prev.solvedCategoryIds, mergedSquare.categoryId]
                    : prev.solvedCategoryIds;

                const isWon = newSolvedCategoryIds.length === 10;

                return {
                    ...prev,
                    grid: newGrid,
                    solvedCategoryIds: newSolvedCategoryIds,
                    status: isWon ? 'won' : 'playing',
                    endTime: isWon ? Date.now() : undefined,
                };
            });

            // Return result with solved category info if applicable
            const solvedCategory = mergedSquare.isSolved
                ? getCategoryById(mergedSquare.categoryId)
                : undefined;

            return { success: true, mergedSquare, solvedCategory };
        },
        [getSquareById, getCategoryById]
    );

    // ===========================================================================
    // SELECTION LOGIC
    // ===========================================================================

    /**
     * Handles square selection. When 2nd square is selected, immediately
     * attempts merge and clears selection.
     */
    const selectSquare = useCallback(
        (squareId: string) => {
            // Ignore if game is won
            if (gameState.status === 'won') return;

            // Ignore if square is already solved
            const square = getSquareById(squareId);
            if (!square || square.isSolved) return;

            // Clear any previous merge result and shake
            setLastMergeResult(null);
            setShakingSquareIds([]);

            setSelectedSquareIds((prev) => {
                // If already selected, deselect it
                if (prev.includes(squareId)) {
                    return prev.filter((id) => id !== squareId);
                }

                // If this is the second selection, attempt merge
                if (prev.length === 1) {
                    const result = attemptMerge(prev[0], squareId);
                    setLastMergeResult(result);

                    // If merge failed, trigger shake on both squares
                    if (!result.success) {
                        setShakingSquareIds([prev[0], squareId]);
                    }

                    // Clear selection after merge attempt (success or fail)
                    return [];
                }

                // First selection
                return [squareId];
            });
        },
        [gameState.status, getSquareById, attemptMerge]
    );

    const clearSelection = useCallback(() => {
        setSelectedSquareIds([]);
        setLastMergeResult(null);
        setShakingSquareIds([]);
    }, []);

    const clearShake = useCallback(() => {
        setShakingSquareIds([]);
    }, []);

    // ===========================================================================
    // GAME CONTROL
    // ===========================================================================

    const resetGame = useCallback(() => {
        setGameState(initializeGameState(puzzle));
        setSelectedSquareIds([]);
        setLastMergeResult(null);
        setShakingSquareIds([]);
    }, [puzzle]);

    // ===========================================================================
    // RETURN
    // ===========================================================================

    return {
        gameState,
        selectedSquareIds,
        lastMergeResult,
        shakingSquareIds,
        selectSquare,
        resetGame,
        clearSelection,
        clearShake,
        isSquareSelected,
        getSquareById,
        getCategoryById,
    };
};