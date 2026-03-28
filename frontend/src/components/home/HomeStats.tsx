import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen, Library } from 'lucide-react-native';

interface HomeStatsProps {
  storyCount: number | undefined;
}

export const HomeStats: React.FC<HomeStatsProps> = ({ storyCount }) => {
  const countDisplay = storyCount !== undefined ? storyCount : '-';
  
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: '#e0e7ff' }]}>
        <BookOpen size={24} color="#6366f1" />
        <Text style={styles.statNumber}>{countDisplay}</Text>
        <Text style={styles.statLabel}>Stories Created</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
        <Library size={24} color="#ef4444" />
        <Text style={styles.statNumber}>{countDisplay}</Text>
        <Text style={styles.statLabel}>Library</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
