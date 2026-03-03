import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';

import { useQuery } from "convex/react";
import { ChevronLeft } from 'lucide-react-native';
import { Story, StoryPage } from '../types/Story';

const StoryDetailScreen = ({ route, navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const { storyId } = route.params;

    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch specific story details
    const story = useQuery("stories:get" as any, { id: storyId }) as Story | undefined;

    console.log("Story:", story);

    if (story === undefined) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    if (story === null) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Story not found.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalPages = story.pages.length;

    const handleNext = () => {
        if (currentIndex < totalPages) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleMomentumScrollEnd = (event: any) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <ChevronLeft size={28} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{story.title}</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={story.pages}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                renderItem={({ item, index }: { item: StoryPage, index: number }) => {
                    const imageUrl = item.imageUrl || null;
                    return (
                        <View style={[styles.pageContainer, { width, height: height - 100 }]}>
                            {imageUrl ? (
                                <Image source={{ uri: imageUrl }} style={styles.pageImage} resizeMode="contain" accessibilityLabel={item.textContent} />
                            ) : (
                                <View style={[styles.pageImage, styles.placeholderImage]}>
                                    <ActivityIndicator size="large" color="#94a3b8" />
                                    <Text style={styles.generatingText}>Generating page...</Text>
                                </View>
                            )}

                            {/* Pagination Overlays */}
                            <TouchableOpacity
                                style={styles.leftOverlay}
                                onPress={handlePrev}
                                activeOpacity={1}
                            />
                            <TouchableOpacity
                                style={styles.rightOverlay}
                                onPress={handleNext}
                                activeOpacity={1}
                            />
                        </View>
                    );
                }}
                ListFooterComponent={() => (
                    <View style={[styles.pageContainer, styles.center, { width, height: height - 100 }]}>
                        <Text style={styles.endText}>The End</Text>
                        <TouchableOpacity
                            style={styles.leftOverlay}
                            onPress={handlePrev}
                            activeOpacity={1}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backIcon: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginHorizontal: 16,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    pageImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    placeholderImage: {
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    generatingText: {
        color: '#94a3b8',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    endText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        fontStyle: 'italic',
    },
    errorText: {
        fontSize: 18,
        color: '#ef4444',
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    leftOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '50%',
        zIndex: 10,
    },
    rightOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '50%',
        zIndex: 10,
    }
});

export default StoryDetailScreen;
