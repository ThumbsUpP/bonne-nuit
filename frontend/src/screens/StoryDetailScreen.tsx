import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useQuery } from "convex/react";
import { ChevronLeft } from 'lucide-react-native';
import { Story, StoryPage } from '../types/Story';

const StoryDetailScreen = ({ route, navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const { storyId } = route.params;

    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReadingMode, setIsReadingMode] = useState(true);

    const story = useQuery("stories:get" as any, { id: storyId }) as Story | undefined;

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
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const toggleReadingMode = () => {
        setIsReadingMode(!isReadingMode);
    };

    const isEndPage = currentIndex === totalPages;
    const currentPage = !isEndPage ? story.pages[currentIndex] : null;
    const imageUrl = currentPage?.imageUrl || null;

    return (
        <View style={styles.container}>
            <StatusBar hidden={isReadingMode} />

            {!isReadingMode && (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                        <ChevronLeft size={28} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{story.title}</Text>
                    <View style={{ width: 28 }} />
                </View>
            )}

            <View style={[styles.pageContainer, { width, height: '100%' }]}>
                {isEndPage ? (
                    <View style={[styles.pageContainer, styles.center, { width, height: '100%' }]}>
                        <Text style={styles.endText}>The End</Text>
                    </View>
                ) : (
                    imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.pageImage}
                            resizeMode="cover"
                            accessibilityLabel={currentPage?.textContent}
                        />
                    ) : (
                        <View style={[styles.pageImage, styles.placeholderImage]}>
                            <ActivityIndicator size="large" color="#94a3b8" />
                            <Text style={styles.generatingText}>Generating page...</Text>
                        </View>
                    )
                )}
            </View>

            {/* Global Pagination Overlays */}
            <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.leftOverlay}
                    onPress={handlePrev}
                    activeOpacity={1}
                />
                <TouchableOpacity
                    style={styles.centerOverlay}
                    onPress={toggleReadingMode}
                    activeOpacity={1}
                />
                {/* Only show next overlay if we are not on the end page, or we can just let it be inactive but better to keep it to allow moving forward till end */}
                <TouchableOpacity
                    style={styles.rightOverlay}
                    onPress={handleNext}
                    activeOpacity={1}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        zIndex: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#1e293b',
    },
    placeholderImage: {
        backgroundColor: '#1e293b',
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
        width: '30%',
        zIndex: 10,
    },
    centerOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '30%',
        width: '40%',
        zIndex: 10,
    },
    rightOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '30%',
        zIndex: 10,
    }
});

export default StoryDetailScreen;
