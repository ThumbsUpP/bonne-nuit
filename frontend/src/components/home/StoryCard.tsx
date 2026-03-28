import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { BookOpen, Trash2 } from 'lucide-react-native';

interface StoryCardProps {
  item: any;
  onPress: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export const StoryCard: React.FC<StoryCardProps> = ({ item, onPress, onDelete }) => (
  <View style={styles.storyCard}>
    <TouchableOpacity
      style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
      onPress={() => onPress(item._id)}
    >
      {item.pages?.[0]?.imageUrl ? (
        <Image source={{ uri: item.pages[0].imageUrl }} style={styles.storyImage} />
      ) : (
        <View style={[styles.storyImage, styles.placeholderImage]}>
          <BookOpen size={24} color="#94a3b8" />
        </View>
      )}
      <View style={styles.storyInfo}>
        <Text style={styles.storyTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.storyPages}>{item.pages?.length || 0} Pages • {item.ageGroup}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.deleteButton}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      onPress={() => {
        console.log("Delete tapped for", item._id);
        onDelete(item._id).catch(() => {
          Alert.alert("Error", "Could not delete story. Please try again.");
        });
      }}
    >
      <Trash2 size={20} color="#ef4444" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  storyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  storyPages: {
    fontSize: 14,
    color: '#64748b',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
