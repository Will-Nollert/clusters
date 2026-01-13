/**
 * TrophyCard.tsx
 *
 * Displays a solved category as a compact "trophy" card.
 * Shows category name with difficulty-based color.
 * These appear at the top of the game board as players complete categories.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Category } from '../types/game';
import { COLORS, getDifficultyColor } from '../constants';

// =============================================================================
// TYPES
// =============================================================================

interface TrophyCardProps {
    category: Category;
    /** Called when user taps to see all items in the category */
    onPress: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const TrophyCard: React.FC<TrophyCardProps> = ({ category, onPress }) => {
    const backgroundColor = getDifficultyColor(category.difficulty);

    return (
        <Pressable
            style={[styles.container, { backgroundColor }]}
            onPress={onPress}
        >
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.itemCount}>
                {category.items.length} items • Difficulty {category.difficulty}
            </Text>
        </Pressable>
    );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 8,
    },
    categoryName: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    itemCount: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 4,
        opacity: 0.85,
    },
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default TrophyCard;