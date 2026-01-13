/**
 * ClusterPreview.tsx
 *
 * Modal overlay that displays all items within a cluster.
 * Triggered by long-pressing a cluster (2+ items) on the grid.
 * Helps players remember what they've grouped together.
 */

import React from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { GridSquare } from '../types/game';
import { COLORS } from '../constants/colors';

// =============================================================================
// TYPES
// =============================================================================

interface ClusterPreviewProps {
    /** The cluster to preview, or null if modal should be hidden */
    cluster: GridSquare | null;
    /** Called when user dismisses the modal */
    onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ClusterPreview: React.FC<ClusterPreviewProps> = ({
    cluster,
    onClose,
}) => {
    if (!cluster) return null;

    const itemCount = cluster.items.length;
    const progressText = `${itemCount} of 10 items`;

    return (
        <Modal
            visible={!!cluster}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                {/* Prevent taps on content from closing modal */}
                <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Cluster Contents</Text>
                        <Text style={styles.progress}>{progressText}</Text>
                    </View>

                    {/* Item list */}
                    <ScrollView
                        style={styles.itemList}
                        contentContainerStyle={styles.itemListContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {cluster.items.map((item, index) => (
                            <View key={`${item}-${index}`} style={styles.itemRow}>
                                <Text style={styles.itemText}>{item}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Close button */}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Done</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        width: '100%',
        maxWidth: 300,
        maxHeight: '70%',
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.squareBorder,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    progress: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    itemList: {
        maxHeight: 250,
    },
    itemListContent: {
        padding: 16,
        gap: 8,
    },
    itemRow: {
        backgroundColor: COLORS.squareDefault,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    closeButton: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.squareBorder,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.selected,
    },
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default ClusterPreview;