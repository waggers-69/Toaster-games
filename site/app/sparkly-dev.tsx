import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Head from 'expo-router/head';

export default function ComingSoon() {
  return (
    <View style={styles.root}>
      <Head>
        <title>Sparkly Dev — Coming Soon</title>
        <meta
          name="description"
          content="Sparkly Developer Platform — build, publish, and scale games."
        />
      </Head>

      <ImageBackground
        source={{ uri: 'https://picsum.photos/1600/900?blur=6' }}
        style={styles.background}
        blurRadius={Platform.OS === 'web' ? 0 : 8} // native blur fallback
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.kicker}>Sparkly Developer Platform</Text>

          <Text style={styles.title}>
            Coming{'\n'}
            <Text style={styles.accent}>Soon</Text>
          </Text>

          <Text style={styles.subtitle}>
            Tools, APIs, and dashboards for building the next generation of
            Sparkly games.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => window.location.href = '/docs'}
          >
            <Text style={styles.buttonText}>View Docs →</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },

  background: {
    flex: 1,
    justifyContent: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.75)',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },

  kicker: {
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  title: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 68,
    marginBottom: 24,
  },

  accent: {
    color: '#ec4899',
  },

  subtitle: {
    maxWidth: 520,
    textAlign: 'center',
    fontSize: 16,
    color: '#cbd5f5',
    marginBottom: 40,
  },

  button: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export const screenOptions = {
  headerShown: false,
};
