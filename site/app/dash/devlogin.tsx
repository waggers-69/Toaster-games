import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Head from 'expo-router/head';
import { auth } from '@/assets/data/firebaseConfig.js';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [errorMsg, setErrorMsg] = useState(null);
  const displayMap = (msg: string) => {
    switch (msg) {
      case 'Firebase: Error (auth/popup-closed-by-user).':
        return 'The login popup was closed before completing the sign-in. Please try again.';
      case 'Firebase: Error (auth/cancelled-popup-request).':
        return 'A login request is already in progress. Please complete the existing login or try again later.';
      case 'Firebase: Error (auth/admin-restricted-operation).':
        return 'Your account is not eligible for the developer dashboard. Account creation may be temporarily suspended. Contact support or try again later.';
      default:
        return 'An unexpected error occurred during authentication. Please try again.';
    }
  }
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = async () => {
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.replace('/dash/admin');
      }
    } catch (error) {
      console.error("Auth error:", error.message);
      // Set the error message to trigger the modal
      setErrorMsg(displayMap(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Head>
        <title>Sparkly Dev — Login</title>
      </Head>

      {/* Gracious Error Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!errorMsg}
        onRequestClose={() => setErrorMsg(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Oops!</Text>
            <Text style={styles.modalText}>{errorMsg}</Text>
            <Pressable 
              style={styles.modalButton} 
              onPress={() => setErrorMsg(null)}
            >
              <Text style={styles.buttonText2}>Exit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ImageBackground
        source={{ uri: 'https://picsum.photos/1600/900?blur=10' }}
        style={styles.background}
        blurRadius={Platform.OS === 'web' ? 0 : 8}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Text style={styles.kicker}>Developer Access</Text>
          <Text style={styles.title}>Welcome{'\n'}<Text style={styles.accent}>Back</Text></Text>
          <Text style={styles.subtitle}>
            Sign in with your GitHub account to manage your games and access your dashboard.
          </Text>

          <Pressable
            style={[styles.githubButton, loading && { opacity: 0.7 }]}
            onPress={handleGithubLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <Text style={styles.buttonText2}><Ionicons name="logo-github" size={20} color="#020617" style={{ marginRight: 8, verticalAlign: 'middle' }} /> Continue with GitHub</Text>
            )}
          </Pressable>

          <Pressable style={styles.button} onPress={() => router.push('/docs')}>
            <Text style={styles.buttonText}>View Documentation</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  background: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.75)' },
  content: { alignItems: 'center', paddingHorizontal: 24, zIndex: 1 },
  kicker: { color: '#94a3b8', fontSize: 12, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 64, fontWeight: '900', color: '#ffffff', textAlign: 'center', lineHeight: 68, marginBottom: 24 },
  accent: { color: '#ec4899' },
  subtitle: { maxWidth: 520, textAlign: 'center', fontSize: 16, color: '#cbd5f5', marginBottom: 40 },
  
  // New Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)', // Pink border glow
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  modalText: { color: '#cbd5f5', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },

  githubButton: {
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },
  buttonText2: { color: '#020617', fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },
});