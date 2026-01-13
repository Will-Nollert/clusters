/**
 * GameBoard.tsx
 *
 * The main game grid with fluid row-fill layout.
 * 
 * Features:
 * - Trophy section at top showing solved categories
 * - Fluid rows where items fill proportionally (no gaps)
 * - Dynamic sizing based on item count within each row
 * - Shake animation feedback on failed merges
 */

import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
    Modal,
    Pressable,
} from 'react-native';
import { GridItem } from './GridItem';
import { TrophyCard } from './TrophyCard';
import { GridSquare, Category } from '../types/game';
import { GRID_GAP } from '../constants';
import { COLORS } from '../constants/colors';
import {
    packIntoRows,
    getUnsolvedSquares,
    getSolvedSquares,
    LayoutRow,
} from '../utils/gridLayout';

// =============================================================================
// TYPES
// =============================================================================

interface GameBoardProps {
    grid: GridSquare[];
    selectedSquareIds: string[];
    onSquarePress: (squareId: string) => void;
    onSquareLongPress: (square: GridSquare) => void;
    getCategoryById: (categoryId: string) => Category | undefined;
    /** IDs of squares that should show shake animation */
    shakingSquareIds: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Horizontal padding on each side of the board */
const BOARD_PADDING = 12;

/** Height of each row in the grid */
const ROW_HEIGHT = 70;

// =============================================================================
// COMPONENT
// =============================================================================

export const GameBoard: React.FC<GameBoardProps> = ({
    grid,
    selectedSquareIds,
    onSquarePress,
    onSquareLongPress,
    getCategoryById,
    shakingSquareIds,
}) => {
    const { width: screenWidth } = useWindowDimensions();

    // ===========================================================================
    // LOCAL STATE
    // ===========================================================================

    /** Category to show in trophy detail modal */
    const [trophyDetail, setTrophyDetail] = useState<Category | null>(null);

    // ===========================================================================
    // LAYOUT CALCULATIONS
    // ===========================================================================

    /** Available width for grid content */
    const contentWidth = screenWidth - BOARD_PADDING * 2;

    /** Separate solved (trophies) from unsolved (grid items) */
    const solvedSquares = useMemo(() => getSolvedSquares(grid), [grid]);
    const unsolvedSquares = useMemo(() => getUnsolvedSquares(grid), [grid]);

    /** Pack unsolved squares into fluid rows */
    const rows = useMemo(() => packIntoRows(unsolvedSquares), [unsolvedSquares]);

    // ===========================================================================
    // RENDER HELPERS
    // ===========================================================================

    const renderTrophySection = () => {
        if (solvedSquares.length === 0) return null;

        return (
            <View style={styles.trophySection}>
                <Text style={styles.sectionTitle}>
                    Solved ({solvedSquares.length}/10)
                </Text>
                {solvedSquares.map((square) => {
                    const category = getCategoryById(square.categoryId);
                    if (!category) return null;

                    return (
                        <TrophyCard
                            key={square.id}
                            category={category}
                            onPress={() => setTrophyDetail(category)}
                        />
                    );
                })}
            </View>
        );
    };

    const renderGridRow = (row: LayoutRow, rowIndex: number) => {
        return (
            <View key={`row-${rowIndex}`} style={[styles.row, { height: ROW_HEIGHT }]}>
                {row.squares.map((square) => {
                    const category = getCategoryById(square.categoryId);
                    if (!category) return null;

                    // Width is proportional to item count within this row
                    const widthFraction = square.items.length / row.totalItems;
                    const itemWidth = widthFraction * contentWidth - GRID_GAP;

                    // Check if this square should shake
                    const shouldShake = shakingSquareIds.includes(square.id);

                    return (
                        <GridItem
                            key={square.id}
                            square={square}
                            category={category}
                            isSelected={selectedSquareIds.includes(square.id)}
                            onPress={() => onSquarePress(square.id)}
                            onLongPress={() => onSquareLongPress(square)}
                            width={itemWidth}
                            height={ROW_HEIGHT - GRID_GAP}
                            shouldShake={shouldShake}
                        />
                    );
                })}
            </View>
        );
    };

    const renderTrophyDetailModal = () => (
        <Modal
            visible={!!trophyDetail}
            transparent
            animationType="fade"
            onRequestClose={() => setTrophyDetail(null)}
        >
            <Pressable
                style={styles.modalBackdrop}
                onPress={() => setTrophyDetail(null)}
            >
                <Pressable
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: trophyDetail
                                ? getDifficultyColorForModal(trophyDetail.difficulty)
                                : COLORS.surface,
                        },
                    ]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text style={styles.modalTitle}>{trophyDetail?.name}</Text>
                    <View style={styles.modalItems}>
                        {trophyDetail?.items.map((item, index) => (
                            <Text key={`${item}-${index}`} style={styles.modalItem}>
                                {item}
                            </Text>
                        ))}
                    </View>
                    <Pressable
                        style={styles.modalClose}
                        onPress={() => setTrophyDetail(null)}
                    >
                        <Text style={styles.modalCloseText}>Done</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );

    // ===========================================================================
    // RENDER
    // ===========================================================================

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Trophy Section */}
            {renderTrophySection()}

            {/* Grid Section */}
            {unsolvedSquares.length > 0 && (
                <View style={styles.gridSection}>
                    <Text style={styles.sectionTitle}>
                        {solvedSquares.length > 0 ? 'Remaining Items' : 'Find the clusters'}
                    </Text>
                    <View style={[styles.gridContainer, { paddingHorizontal: BOARD_PADDING }]}>
                        {rows.map((row, index) => renderGridRow(row, index))}
                    </View>
                </View>
            )}

            {/* Trophy Detail Modal */}
            {renderTrophyDetailModal()}
        </ScrollView>
    );
};

// =============================================================================
// HELPERS
// =============================================================================

const getDifficultyColorForModal = (difficulty: number): string => {
    const colors: Record<number, string> = {
        1: '#2ecc71',
        2: '#58d68d',
        3: '#82e0aa',
        4: '#f4d03f',
        5: '#f5b041',
        6: '#eb984e',
        7: '#e67e22',
        8: '#e74c3c',
        9: '#c0392b',
        10: '#8e44ad',
    };
    return colors[difficulty] ?? COLORS.surface;
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    trophySection: {
        paddingHorizontal: BOARD_PADDING,
        paddingTop: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    gridSection: {
        paddingTop: 16,
    },
    gridContainer: {
        gap: GRID_GAP,
    },
    row: {
        flexDirection: 'row',
        gap: GRID_GAP,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    modalItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    modalItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    modalClose: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingVertical: 12,
        borderRadius: 8,
    },
    modalCloseText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default GameBoard;