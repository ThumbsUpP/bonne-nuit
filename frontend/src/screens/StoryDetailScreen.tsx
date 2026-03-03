import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import { useQuery } from "convex/react";
import { ChevronLeft } from 'lucide-react-native';
import { Story, StoryPage } from '../types/Story';

const StoryDetailScreen = ({ route, navigation }: any) => {
    const { storyId } = route.params;

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
                data={story.pages}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: { item: StoryPage }) => {
                    const imageUrl = item.imageUrl || null;
                    return (
                        <View style={styles.pageContainer}>
                            {imageUrl ? (
                                <Image source={{ uri: imageUrl }} style={styles.pageImage} resizeMode="contain" accessibilityLabel={item.textContent} />
                            ) : (
                                <View style={[styles.pageImage, styles.placeholderImage]}>
                                    <ActivityIndicator size="large" color="#94a3b8" />
                                    <Text style={styles.generatingText}>Generating page...</Text>
                                </View>
                            )}
                        </View>
                    );
                }}
                ListFooterComponent={() => (
                    <View style={[styles.pageContainer, styles.center]}>
                        <Text style={styles.endText}>The End</Text>
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
        width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    pageImage: {
        width: '100%',
        height: '100%',
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
    }
});

export default StoryDetailScreen;
