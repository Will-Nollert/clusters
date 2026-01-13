/**
 * GridItem.tsx
 *
 * A single cell on the game grid. Can represent:
 * - A single item (shows text)
 * - A cluster of merged items (shows items as pills)
 * 
 * Features:
 * - Fluid width based on item count within row
 * - Shake animation on failed merge attempts
 * - Pills display for clusters
 */

import React, { useEffect, useRef } from 'react';
import {
    Pressable,
    Text,
    View,
    StyleSheet,
    Animated,
} from 'react-native';
import { GridSquare, Category } from '../types/game';
import { COLORS } from '../constants';
import { CLUSTER_PADDING, PILL_HEIGHT, SHAKE_DURATION_MS } from '../constants/gameConfig';

// =============================================================================
// TYPES
// =============================================================================

interface GridItemProps {
    square: GridSquare;
    category: Category;
    isSelected: boolean;
    onPress: () => void;
    onLongPress: () => void;
    /** Computed width for this item */
    width: number;
    /** Computed height for this item */
    height: number;
    /** Trigger shake animation (failed merge) */
    shouldShake?: boolean;
}

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

const SHAKE_DISTANCE = 10;
const SHAKE_COUNT = 4;

// =============================================================================
// COMPONENT
// =============================================================================

export const GridItem: React.FC<GridItemProps> = ({
    square,
    category,
    isSelected,
    onPress,
    onLongPress,
    width,
    height,
    shouldShake = false,
}) => {
    const isSingleItem = square.items.length === 1;

    // ===========================================================================
    // SHAKE ANIMATION
    // ===========================================================================

    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (shouldShake) {
            // Create shake sequence: left-right-left-right-center
            const shakeSequence = Animated.sequence([
                ...Array(SHAKE_COUNT).fill(null).flatMap(() => [
                    Animated.timing(shakeAnim, {
                        toValue: SHAKE_DISTANCE,
                        duration: SHAKE_DURATION_MS / (SHAKE_COUNT * 2),
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: -SHAKE_DISTANCE,
                        duration: SHAKE_DURATION_MS / (SHAKE_COUNT * 2),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: SHAKE_DURATION_MS / (SHAKE_COUNT * 2),
                    useNativeDriver: true,
                }),
            ]);

            shakeSequence.start();
        }
    }, [shouldShake, shakeAnim]);

    // ===========================================================================
    // STYLES
    // ===========================================================================

    const backgroundColor = isSelected ? COLORS.selected : COLORS.squareDefault;
    const borderColor = isSelected ? COLORS.selectedBorder : COLORS.squareBorder;
    const borderWidth = isSelected ? 2 : 1;

    // ===========================================================================
    // RENDER HELPERS
    // ===========================================================================

    const renderSingleItem = () => (
        <Text style={styles.singleItemText} numberOfLines={2} adjustsFontSizeToFit>
            {square.items[0]}
        </Text>
    );

    const renderCluster = () => (
        <View style={styles.pillContainer}>
            {square.items.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.pill}>
                    <Text style={styles.pillText} numberOfLines={1}>
                        {item}
                    </Text>
                </View>
            ))}
        </View>
    );

    // ===========================================================================
    // RENDER
    // ===========================================================================

    return (
        <Animated.View
            style={{
                transform: [{ translateX: shakeAnim }],
            }}
        >
            <Pressable
                style={[
                    styles.container,
                    {
                        width,
                        height,
                        backgroundColor,
                        borderColor,
                        borderWidth,
                    },
                ]}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={300}
            >
                {isSingleItem ? renderSingleItem() : renderCluster()}
            </Pressable>
        </Animated.View>
    );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: CLUSTER_PADDING,
        overflow: 'hidden',
    },
    singleItemText: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    pill: {
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: PILL_HEIGHT / 2,
        height: PILL_HEIGHT,
        justifyContent: 'center',
    },
    pillText: {
        color: COLORS.textPrimary,
        fontSize: 11,
        fontWeight: '500',
    },
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default GridItem;