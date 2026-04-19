import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function ARNavigationScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<any>();

  if (!permission) {
    return <View style={styles.container} />; // Loading permissions
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to render AR navigation overlays.</Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        {/* AR Overlay Container */}
        <View style={styles.overlayContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Exit AR Mode</Text>
          </TouchableOpacity>
          
          <View style={styles.instructionBanner}>
            <Text style={styles.instructionText}>Follow the Green Path →</Text>
          </View>

          {/* Simulated Green Path AR Graphic (Perspective shifted arrow cluster) */}
          <View style={styles.arPathContainer}>
            <View style={styles.pathLine} />
            <View style={styles.pathArrowWrapper}>
              <View style={styles.pathArrowHead} />
            </View>
          </View>

          <View style={styles.footerOverlay}>
            <Text style={styles.footerText}>Virtual Queue: Ready in 4 min</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  permissionText: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  grantButton: { backgroundColor: '#00D1FF', padding: 15, marginHorizontal: 40, borderRadius: 30, alignItems: 'center' },
  grantButtonText: { color: '#000', fontWeight: 'bold' },
  camera: { flex: 1 },
  overlayContainer: { flex: 1, backgroundColor: 'transparent', padding: 20, paddingTop: 60 },
  backBtn: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 },
  backBtnText: { color: '#00D1FF', fontSize: 16, fontWeight: 'bold' },
  instructionBanner: { alignSelf: 'center', backgroundColor: 'rgba(0,255,100,0.8)', marginTop: 20, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 20 },
  instructionText: { color: '#000', fontSize: 20, fontWeight: '900' },
  footerOverlay: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#00FF64' },
  footerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  arPathContainer: { position: 'absolute', bottom: 120, alignSelf: 'center', alignItems: 'center' },
  pathLine: {
    width: 25,
    height: 300,
    backgroundColor: 'rgba(0, 255, 100, 0.65)',
    transform: [{ perspective: 600 }, { rotateX: '55deg' }], 
    shadowColor: '#00FF64',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  pathArrowWrapper: {
    position: 'absolute',
    top: -20, // Places arrow head on top of the path line
    transform: [{ perspective: 600 }, { rotateX: '55deg' }], 
  },
  pathArrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 35,
    borderBottomWidth: 50,
    borderLeftWidth: 35,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 255, 100, 0.85)',
    borderLeftColor: 'transparent',
  }
});
