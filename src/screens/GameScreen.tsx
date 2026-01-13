/**
 * GameScreen.tsx
 *
 * Main game screen that orchestrates the Clusters gameplay experience.
 * Connects the game state hook to all UI components and manages:
 * - Game board display
 * - Cluster preview modal
 * - Stats display (mistakes, progress)
 * - Win state celebration
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { useGameState } from '../hooks/useGameState';
import { GameBoard } from '../components/GameBoard';
import { ClusterPreview } from '../components/ClusterPreview';
import { SAMPLE_PUZZLE } from '../data/samplePuzzle';
import { GridSquare } from '../types/game';
import { COLORS } from '../constants/colors';

// =============================================================================
// COMPONENT
// =============================================================================

export const GameScreen: React.FC = () => {
    // ===========================================================================
    // GAME STATE
    // ===========================================================================

    const {
        gameState,
        selectedSquareIds,
        shakingSquareIds,
        selectSquare,
        resetGame,
        getCategoryById,
    } = useGameState(SAMPLE_PUZZLE);

    // ===========================================================================
    // LOCAL UI STATE
    // ===========================================================================

    /** Cluster currently being previewed via long-press (null = modal hidden) */
    const [previewCluster, setPreviewCluster] = useState<GridSquare | null>(null);

    // ===========================================================================
    // HANDLERS
    // ===========================================================================

    const handleSquarePress = useCallback(
        (squareId: string) => {
            selectSquare(squareId);
        },
        [selectSquare]
    );

    /**
     * Long-press shows cluster contents.
     * Only meaningful for clusters with 2+ items.
     */
    const handleSquareLongPress = useCallback((square: GridSquare) => {
        if (square.items.length > 1 && !square.isSolved) {
            setPreviewCluster(square);
        }
    }, []);

    const handleClosePreview = useCallback(() => {
        setPreviewCluster(null);
    }, []);

    // ===========================================================================
    // COMPUTED VALUES
    // ===========================================================================

    const solvedCount = gameState.solvedCategoryIds.length;
    const totalCategories = SAMPLE_PUZZLE.categories.length;
    const isWon = gameState.status === 'won';

    /** Format elapsed time as mm:ss */
    const formatTime = (startTime: number, endTime?: number): string => {
        const elapsed = (endTime ?? Date.now()) - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ===========================================================================
    // RENDER
    // ===========================================================================

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Clusters</Text>
                <Text style={styles.subtitle}>Group the related items</Text>
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{solvedCount}/{totalCategories}</Text>
                    <Text style={styles.statLabel}>Solved</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{gameState.mistakes}</Text>
                    <Text style={styles.statLabel}>Mistakes</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {formatTime(gameState.startTime, gameState.endTime)}
                    </Text>
                    <Text style={styles.statLabel}>Time</Text>
                </View>
            </View>

            {/* Game Board */}
            <GameBoard
                grid={gameState.grid}
                selectedSquareIds={selectedSquareIds}
                onSquarePress={handleSquarePress}
                onSquareLongPress={handleSquareLongPress}
                getCategoryById={getCategoryById}
                shakingSquareIds={shakingSquareIds}
            />

            {/* Win Overlay */}
            {isWon && (
                <View style={styles.winOverlay}>
                    <View style={styles.winContent}>
                        <Text style={styles.winTitle}>🎉 You Won!</Text>
                        <Text style={styles.winStats}>
                            Time: {formatTime(gameState.startTime, gameState.endTime)}
                        </Text>
                        <Text style={styles.winStats}>
                            Mistakes: {gameState.mistakes}
                        </Text>
                        <Pressable style={styles.playAgainButton} onPress={resetGame}>
                            <Text style={styles.playAgainText}>Play Again</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Cluster Preview Modal */}
            <ClusterPreview
                cluster={previewCluster}
                onClose={handleClosePreview}
            />
        </SafeAreaView>
    );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    statsBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.squareBorder,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    winOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    winContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    winTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    winStats: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    playAgainButton: {
        backgroundColor: COLORS.selected,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginTop: 16,
    },
    playAgainText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default GameScreen;