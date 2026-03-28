import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface HomeHeaderProps {
  email: string | undefined;
  onLogout: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ email, onLogout }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.welcome}>Hello!</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <LogOut size={20} color="#64748b" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});
