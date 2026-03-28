import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { StoryCard } from './StoryCard';

interface StoryListProps {
  stories: any[] | undefined;
  onStoryPress: (id: string) => void;
  onStoryDelete: (id: string) => Promise<void>;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, onStoryPress, onStoryDelete }) => {
  if (stories === undefined) {
    return <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />;
  }

  if (stories.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>You haven't created any stories yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <StoryCard 
            item={item} 
            onPress={onStoryPress} 
            onDelete={onStoryDelete} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    marginTop: 24,
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
  },
});
