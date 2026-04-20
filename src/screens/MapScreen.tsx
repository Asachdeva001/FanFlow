import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { auth, database, functions } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, set } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

const STADIUM_COORDS = { latitude: 33.9535, longitude: -118.3390, latitudeDelta: 0.005, longitudeDelta: 0.005 };

// Simulated Hot Zones
const HEATMAP_POINTS = [
  { latitude: 33.9540, longitude: -118.3389, weight: 100 },
  { latitude: 33.9541, longitude: -118.3391, weight: 80 },
  { latitude: 33.9539, longitude: -118.3390, weight: 90 },
];

const ROUTING_COORDS = [
  { latitude: 33.9535, longitude: -118.3390 }, // Fan Location
  { latitude: 33.9533, longitude: -118.3384 }, // Bypass
  { latitude: 33.9542, longitude: -118.3380 }, 
  { latitude: 33.9545, longitude: -118.3390 }, // Concession
];

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

type SquadMember = { latitude: number; longitude: number; foodRun: boolean };

export default function MapScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation<any>();
  
  const [squad, setSquad] = useState<Record<string, SquadMember>>({});
  const [isFoodRun, setIsFoodRun] = useState(false);
  const [rendezvous, setRendezvous] = useState<{ latitude: number, longitude: number } | null>(null);

  // Synchronize with Firebase Realtime DB
  useEffect(() => {
    if (!user) return;
    const squadRef = ref(database, 'squads/demo-squad');
    
    // Listener fires constantly upon sub-second location updates
    const unsubscribe = onValue(squadRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSquad(data);
      
      // Efficiency Optimization: Offloaded Adaptive Rendezvous calculation to Cloud Functions
      const members = Object.values(data) as SquadMember[];
      if (members.length > 0) {
        const calculateRendezvous = httpsCallable(functions, 'calculateRendezvous');
        calculateRendezvous({ members }).then((response: any) => {
          if (response.data && response.data.rendezvous) {
            setRendezvous(response.data.rendezvous);
          }
        }).catch(err => console.error("Rendezvous fail:", err));
      }
    });

    // Deploy device's location to the DB cluster
    const myRef = ref(database, `squads/demo-squad/${user.uid}`);
    set(myRef, { latitude: STADIUM_COORDS.latitude, longitude: STADIUM_COORDS.longitude, foodRun: isFoodRun });
    
    // Inject "ghost" squads automatically into DB to simulate squad dynamics
    setTimeout(() => {
      set(ref(database, 'squads/demo-squad/ghost_1'), { latitude: 33.9532, longitude: -118.3385, foodRun: false });
      set(ref(database, 'squads/demo-squad/ghost_2'), { latitude: 33.9538, longitude: -118.3382, foodRun: false });
    }, 1000);

    return () => unsubscribe();
  }, [user, isFoodRun]);

  const toggleFoodRun = () => {
    const nextState = !isFoodRun;
    setIsFoodRun(nextState);
    if (user) {
      set(ref(database, `squads/demo-squad/${user.uid}`), { 
        latitude: STADIUM_COORDS.latitude, 
        longitude: STADIUM_COORDS.longitude, 
        foodRun: nextState 
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={STADIUM_COORDS}
        customMapStyle={darkMapStyle}
        pitchEnabled={true}
        showsBuildings={true}
      >
        <Marker coordinate={{ latitude: 33.9545, longitude: -118.3390 }} title="Hot Dog Stand" pinColor="#00FF64" />
        
        {/* Squad Node Rendering */}
        {Object.entries(squad).map(([uid, member]) => (
          <Marker 
            key={uid} 
            coordinate={{ latitude: member.latitude, longitude: member.longitude }} 
            title={uid === user?.uid ? "You" : `Squad Member (${uid.substring(0,4)})`}
            description={member.foodRun ? "🍔 MAKING A FOOD RUN! ADD ORDERS." : "Watching the game"}
            // Visual differentiation for squad members vs the user
            pinColor={uid === user?.uid ? "#00D1FF" : "#B026FF"} 
          />
        ))}

        {/* Algorithmically calculated Rendezvous Point marker */}
        {rendezvous && (
          <Marker coordinate={rendezvous} title="Squad Rendezvous" description="Equidistant Safe Zone" pinColor="#FFD700" />
        )}
        
        <Heatmap points={HEATMAP_POINTS} radius={45} opacity={0.8} gradient={{ colors: ['#00000000', '#FFAA00', '#FF0055'], startPoints: [0.01, 0.4, 1.0], colorMapSize: 256 }} />
        <Polyline coordinates={ROUTING_COORDS} strokeColor="#00D1FF" strokeWidth={5} lineDashPattern={[10, 5]} />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.uidText}>Fan ID: {user?.uid?.substring(0, 8) || 'GUEST'}</Text>
      </View>
      
      {isFoodRun && (
        <View style={styles.foodRunBanner}>
          <Text style={styles.foodRunText}>🍔 Your 'Food Run' Flag is Active!</Text>
        </View>
      )}

      {/* Social Toolbar */}
      <View style={styles.toolbarRight}>
         <TouchableOpacity 
           style={[styles.sideBtn, { backgroundColor: isFoodRun ? '#FF0055' : '#B026FF' }]} 
           onPress={toggleFoodRun}
           accessible={true}
           accessibilityRole="button"
           accessibilityLabel={isFoodRun ? "Cancel Food Run" : "Flag Food Run"}
           accessibilityHint="Toggles your status to doing a food run for your squad"
           testID="food-run-toggle"
         >
          <Text style={styles.sideBtnText}>{isFoodRun ? "Cancel Run" : "Flag Food Run"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btmRow}>
        <TouchableOpacity 
          style={styles.arBtn} 
          onPress={() => navigation.navigate('ARNavigation')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Launch Green Path AR"
          accessibilityHint="Navigates to the augmented reality route finding screen"
          testID="ar-navigation-button"
        >
          <Text style={styles.arBtnText}>Green Path AR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.floatingBtn} 
          onPress={() => navigation.navigate('Concession')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Order Food from Concessions"
          accessibilityHint="Navigates to the concessions menu to order food"
          testID="concession-button"
        >
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
  foodRunBanner: { position: 'absolute', top: 120, left: 20, backgroundColor: 'rgba(255, 0, 85, 0.9)', padding: 10, borderRadius: 8 },
  foodRunText: { color: '#fff', fontWeight: 'bold' },
  toolbarRight: { position: 'absolute', top: '40%', right: 20, alignItems: 'flex-end'},
  sideBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, marginBottom: 15, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  sideBtnText: { color: '#fff', fontWeight: 'bold' },
  btmRow: { position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  floatingBtn: { backgroundColor: '#00D1FF', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  floatingBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  arBtn: { backgroundColor: '#00FF64', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  arBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
