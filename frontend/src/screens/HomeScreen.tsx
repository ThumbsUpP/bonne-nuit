import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, ActivityIndicator, FlatList, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Library, PlusCircle, Wand2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

import { useQuery, useAction, useConvex } from "convex/react";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user, logOut } = useAuth();
  const navigation = useNavigation<any>();
  const convex = useConvex();
  const generateStoryAction = useAction("gemini:generateStory" as any);
  const generateImageAction = useAction("imagen:generateImage" as any);
  const suggestProposition = useAction("gemini:suggestProposition" as any);

  const [isModalVisible, setModalVisible] = useState(false);
  const [topic, setTopic] = useState("");
  const [protagonist, setProtagonist] = useState("");
  const [childName, setChildName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState({ topic: false, protagonist: false, childName: false });

  // Fetch stories using Convex useQuery
  const stories = useQuery("stories:list" as any, user?.uid ? { userId: user.uid } : "skip" as any);

  const handleSuggest = async (field: 'topic' | 'protagonist' | 'childName') => {
    setIsSuggesting(prev => ({ ...prev, [field]: true }));
    try {
      const suggestion = await suggestProposition({ field });
      if (field === 'topic') setTopic(suggestion);
      else if (field === 'protagonist') setProtagonist(suggestion);
      else if (field === 'childName') setChildName(suggestion);
    } catch (e) {
      console.error("Error generating suggestion:", e);
    } finally {
      setIsSuggesting(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleCreateStory = async () => {
    if (!topic || !protagonist || !childName) return;
    setIsGenerating(true);
    try {
      const storyId = await generateStoryAction({
        userId: user?.uid,
        topic,
        age: 4,
        protagonistName: protagonist,
        childName,
      });

      // Close modal and reset fields
      setModalVisible(false);
      setTopic("");
      setProtagonist("");
      setChildName("");

      // Trigger background image generation!
      // Since it takes a long time, we do it in the background asynchronously
      generateImagesInBackground(storyId);

      // Navigate to the newly created story
      navigation.navigate('StoryDetail', { storyId });

    } catch (e) {
      console.error("Error generating story:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagesInBackground = async (storyId: any) => {
    try {
      const story: any = await convex.query("stories:get" as any, { id: storyId });
      if (!story || !story.pages) return;

      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        const fullPrompt = `Style: ${story.artStyle}.\nCharacter: ${story.characterDescription}.\nScene: ${page.imageDescription}.\nEnsure the character appearance is consistent with the description.\nHigh quality, detailed, ${story.artStyle}.`.trim();

        await generateImageAction({
          storyId,
          pageIndex: i,
          prompt: fullPrompt
        });
      }
    } catch (err) {
      console.error("Failed to generate background images:", err);
    }
  };

  const renderStory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.storyCard}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item._id })}
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
        <Text style={styles.storyPages}>{item.pages.length} Pages • {item.ageGroup}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hello!</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
          <LogOut size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, isTablet ? styles.tabletContent : null]}>
        <Text style={styles.sectionTitle}>Your Magical Stories</Text>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#e0e7ff' }]}>
            <BookOpen size={24} color="#6366f1" />
            <Text style={styles.statNumber}>{stories ? stories.length : '-'}</Text>
            <Text style={styles.statLabel}>Stories Created</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
            <Library size={24} color="#ef4444" />
            <Text style={styles.statNumber}>{stories ? stories.length : '-'}</Text>
            <Text style={styles.statLabel}>Library</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {stories === undefined ? (
            <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
          ) : stories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>You haven't created any stories yet.</Text>
            </View>
          ) : (
            <FlatList
              data={stories}
              keyExtractor={(item) => item._id}
              renderItem={renderStory}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <PlusCircle size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Bedtime Story</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Magical Story</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Topic (e.g., A brave little rabbit)"
                placeholderTextColor="#94a3b8"
                value={topic}
                onChangeText={setTopic}
              />
              <TouchableOpacity 
                style={styles.suggestionButton} 
                onPress={() => handleSuggest('topic')}
                disabled={isSuggesting.topic}
              >
                {isSuggesting.topic ? <ActivityIndicator size="small" color="#6366f1" /> : <Wand2 size={20} color="#6366f1" />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Protagonist (e.g., Pompon)"
                placeholderTextColor="#94a3b8"
                value={protagonist}
                onChangeText={setProtagonist}
              />
              <TouchableOpacity 
                style={styles.suggestionButton} 
                onPress={() => handleSuggest('protagonist')}
                disabled={isSuggesting.protagonist}
              >
                {isSuggesting.protagonist ? <ActivityIndicator size="small" color="#6366f1" /> : <Wand2 size={20} color="#6366f1" />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Child Name (e.g., Alice)"
                placeholderTextColor="#94a3b8"
                value={childName}
                onChangeText={setChildName}
              />
              <TouchableOpacity 
                style={styles.suggestionButton} 
                onPress={() => handleSuggest('childName')}
                disabled={isSuggesting.childName}
              >
                {isSuggesting.childName ? <ActivityIndicator size="small" color="#6366f1" /> : <Wand2 size={20} color="#6366f1" />}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={isGenerating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, (!topic || !protagonist || !childName) && { opacity: 0.5 }]}
                onPress={handleCreateStory}
                disabled={isGenerating || !topic || !protagonist || !childName}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Generate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  tabletContent: {
    paddingHorizontal: 64,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  createButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    height: 56,
    color: '#1e293b',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  suggestionButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
