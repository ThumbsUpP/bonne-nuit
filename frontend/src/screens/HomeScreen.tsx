import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Library, PlusCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const HomeScreen = () => {
  const { user, logOut } = useAuth();

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
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Stories Created</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
            <Library size={24} color="#ef4444" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Library</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton}>
          <PlusCircle size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Bedtime Story</Text>
        </TouchableOpacity>
      </View>
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
});

export default HomeScreen;
