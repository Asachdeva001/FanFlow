import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { auth } from '../config/firebaseConfig';

// SoFi Stadium Coordinates (Demonstration)
const STADIUM_COORDS = {
  latitude: 33.9535,
  longitude: -118.3390,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// A sleek dark mode map style for premium aesthetic
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  }
];

export default function MapScreen() {
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={STADIUM_COORDS}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{ latitude: 33.9535, longitude: -118.3390 }}
          title="SoFi Stadium"
          description="Center Field"
          pinColor="#00D1FF"
        />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.uidText}>Fan ID: {user?.uid?.substring(0, 8) || 'GUEST'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D1FF',
  },
  uidText: {
    color: '#00D1FF',
    fontWeight: 'bold',
  }
});
