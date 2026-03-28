import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { useStories } from '../hooks/useStories';
import { useStoryForm } from '../hooks/useStoryForm';
import { useStoryGeneration } from '../hooks/useStoryGeneration';

import { HomeHeader } from '../components/home/HomeHeader';
import { HomeStats } from '../components/home/HomeStats';
import { StoryList } from '../components/home/StoryList';
import { CreateStoryModal } from '../components/home/CreateStoryModal';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const HomeScreen = () => {
  const { user, logOut } = useAuth();
  const navigation = useNavigation<any>();

  const [isModalVisible, setModalVisible] = useState(false);

  const { stories, deleteStory } = useStories(user?.uid);
  const {
    topic, setTopic,
    protagonist, setProtagonist,
    childName, setChildName,
    isSuggesting, handleSuggest,
    resetForm
  } = useStoryForm();

  const { isGenerating, createStory } = useStoryGeneration();

  const handleCreateStory = () => {
    createStory({
      userId: user?.uid,
      topic,
      protagonist,
      childName,
      onSuccess: (storyId) => {
        setModalVisible(false);
        resetForm();
        navigation.navigate('StoryDetail', { storyId });
      }
    });
  };

  const handleStoryPress = (storyId: string) => {
    navigation.navigate('StoryDetail', { storyId });
  };

  return (
    <View style={styles.container}>
      <HomeHeader email={user?.email} onLogout={logOut} />

      <View style={[styles.content, isTablet ? styles.tabletContent : null]}>
        <Text style={styles.sectionTitle}>Your Magical Stories</Text>

        <HomeStats storyCount={stories?.length} />

        <StoryList
          stories={stories}
          onStoryPress={handleStoryPress}
          onStoryDelete={deleteStory}
        />

        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <PlusCircle size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Bedtime Story</Text>
        </TouchableOpacity>
      </View>

      <CreateStoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        topic={topic}
        setTopic={setTopic}
        protagonist={protagonist}
        setProtagonist={setProtagonist}
        childName={childName}
        setChildName={setChildName}
        isSuggesting={isSuggesting}
        handleSuggest={handleSuggest}
        isGenerating={isGenerating}
        handleCreateStory={handleCreateStory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
});

export default HomeScreen;
