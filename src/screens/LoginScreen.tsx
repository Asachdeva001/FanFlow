import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signInAnonymously } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { auth, app } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleEnterStadium = async () => {
    setLoading(true);
    try {
      // Optional logging for Google Services integration
      try {
        const analytics = getAnalytics(app);
        logEvent(analytics, 'login_attempt', { method: 'anonymous' });
      } catch (e) {
        // Analytics may not be available in some environments
      }
      
      await signInAnonymously(auth);
      // Wait for auth state listener in AppNavigator to switch screens
    } catch (error) {
      console.error("Anonymous Sign-in failed:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FanFlow</Text>
      <Text style={styles.subtitle}>The Frictionless Event Experience</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleEnterStadium}
        disabled={loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Enter Venue"
        accessibilityState={{ disabled: loading }}
        accessibilityHint="Logs you in anonymously and navigates to the stadium map"
        testID="enter-venue-button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" testID="loading-spinner" />
        ) : (
          <Text style={styles.buttonText}>Enter Venue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00D1FF',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#00D1FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#00D1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0a0a',
    letterSpacing: 1,
  }
});
