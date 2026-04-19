import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { functions } from '../config/firebaseConfig';
import { httpsCallable } from 'firebase/functions';

export default function ConcessionScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setAiMessage(null);
    try {
      const calculateTimeToWalk = httpsCallable(functions, 'calculateTimeToWalk');
      const response = await calculateTimeToWalk({
        distance: "120 meters",
        gameState: "2 minutes until Halftime",
        currentQueueLength: 14
      });
      
      const data = response.data as { recommendation: string };
      setAiMessage(data.recommendation);
      Alert.alert("Virtual Queue Joined!", data.recommendation);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to Agentic Concierge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>← Back to Map</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Menu Selection</Text>
      
      <View style={styles.card}>
        <Text style={styles.itemName}>Stadium Hot Dog</Text>
        <Text style={styles.itemPrice}>$8.00</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.itemName}>Craft Beer</Text>
        <Text style={styles.itemPrice}>$12.00</Text>
      </View>

      <View style={{ flex: 1 }} />

      {aiMessage && (
        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>✨ Agentic Concierge Says:</Text>
          <Text style={styles.aiText}>{aiMessage}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.checkoutBtn} 
        onPress={handleCheckout}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.checkoutText}>Join Virtual Queue</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 60 },
  backBtn: { marginBottom: 20, padding: 10 },
  backBtnText: { color: '#00D1FF', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 20 },
  card: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  itemPrice: { color: '#bbb', fontSize: 16 },
  checkoutBtn: { backgroundColor: '#00D1FF', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 20, shadowColor: '#00D1FF', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.4, shadowRadius: 10 },
  checkoutText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  aiBox: { backgroundColor: 'rgba(0, 209, 255, 0.1)', borderColor: '#00D1FF', borderWidth: 1, padding: 15, borderRadius: 10, marginBottom: 20 },
  aiTitle: { color: '#00D1FF', fontWeight: 'bold', marginBottom: 5 },
  aiText: { color: '#fff', lineHeight: 22 }
});
