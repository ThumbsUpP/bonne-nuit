import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Wand2 } from 'lucide-react-native';

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  topic: string;
  setTopic: (t: string) => void;
  protagonist: string;
  setProtagonist: (p: string) => void;
  childName: string;
  setChildName: (c: string) => void;
  isSuggesting: { topic: boolean; protagonist: boolean; childName: boolean };
  handleSuggest: (field: 'topic' | 'protagonist' | 'childName') => void;
  isGenerating: boolean;
  handleCreateStory: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  visible, onClose,
  topic, setTopic,
  protagonist, setProtagonist,
  childName, setChildName,
  isSuggesting, handleSuggest,
  isGenerating, handleCreateStory
}) => {
  const isFormValid = !!(topic && protagonist && childName);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
              onPress={onClose}
              disabled={isGenerating}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !isFormValid && { opacity: 0.5 }]}
              onPress={handleCreateStory}
              disabled={isGenerating || !isFormValid}
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
  );
};

const styles = StyleSheet.create({
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
