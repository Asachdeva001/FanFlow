import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { auth } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const STADIUM_COORDS = { latitude: 33.9535, longitude: -118.3390, latitudeDelta: 0.005, longitudeDelta: 0.005 };

// Simulated densely crowded points (Hot Zones)
const HEATMAP_POINTS = [
  { latitude: 33.9540, longitude: -118.3389, weight: 100 },
  { latitude: 33.9541, longitude: -118.3391, weight: 80 },
  { latitude: 33.9539, longitude: -118.3390, weight: 90 },
  { latitude: 33.9540, longitude: -118.3388, weight: 100 },
  { latitude: 33.9538, longitude: -118.3389, weight: 70 },
];

// Clean routing path bypassing heatmap chokepoint
const ROUTING_COORDS = [
  { latitude: 33.9535, longitude: -118.3390 }, // Fan Location
  { latitude: 33.9533, longitude: -118.3384 }, // Bypass right
  { latitude: 33.9542, longitude: -118.3380 }, // Walk up East corridor
  { latitude: 33.9545, longitude: -118.3390 }, // Cut left to concession
];

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function MapScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={STADIUM_COORDS}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        pitchEnabled={true}
        showsBuildings={true}
      >
        <Marker coordinate={{ latitude: 33.9535, longitude: -118.3390 }} title="Your Seat" pinColor="#00D1FF" />
        <Marker coordinate={{ latitude: 33.9545, longitude: -118.3390 }} title="Hot Dog Stand" pinColor="#00FF64" />
        
        {/* The Live Crowd Density visualizer */}
        <Heatmap 
          points={HEATMAP_POINTS}
          radius={45}
          opacity={0.8}
          gradient={{ colors: ['#00000000', '#FFAA00', '#FF0055'], startPoints: [0.01, 0.4, 1.0], colorMapSize: 256 }}
        />

        {/* The Route actively recalculating past it */}
        <Polyline coordinates={ROUTING_COORDS} strokeColor="#00D1FF" strokeWidth={5} lineDashPattern={[10, 5]} />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.uidText}>Fan ID: {user?.uid?.substring(0, 8) || 'GUEST'}</Text>
      </View>

      <View style={styles.btmRow}>
        <TouchableOpacity style={styles.arBtn} onPress={() => navigation.navigate('ARNavigation')}>
          <Text style={styles.arBtnText}>Green Path AR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.floatingBtn} onPress={() => navigation.navigate('Concession')}>
          <Text style={styles.floatingBtnText}>🍔 Order Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  map: { ...StyleSheet.absoluteFillObject },
  overlay: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#00D1FF' },
  uidText: { color: '#00D1FF', fontWeight: 'bold' },
  btmRow: { position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  floatingBtn: { backgroundColor: '#00D1FF', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, shadowColor: '#00D1FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  floatingBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  arBtn: { backgroundColor: '#00FF64', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, shadowColor: '#00FF64', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  arBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
