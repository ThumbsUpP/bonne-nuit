import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const Navigation = () => {
  const { user, loading } = useAuth();
  console.log('Navigation Component State:', { user: !!user, loading });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size={40} color="#6366f1" />
      </View>
    );
  }

  return user ? <HomeScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
