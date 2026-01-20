import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { auth } from '@/public/firebaseConfig.js';
import { supabase } from '@/public/supabaseConfig.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [gitUrl, setGitUrl] = useState('');

  // 1. Auth Gate: Ensure user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.replace('/dash/devlogin');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/dash/devlogin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 2. Local File Upload Logic
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/zip', 'application/x-zip-compressed', 'text/html'],
        copyToCacheDirectory: false,
      });

      if (result.canceled) return;

      setUploading(true);
      const file = result.assets[0];

      // Convert URI to Blob for Supabase (Web standard)
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const githubUsername = auth.currentUser?.reloadUserInfo?.screenName || 
                             auth.currentUser?.displayName?.replace(/\s+/g, '-').toLowerCase() || 
                             "unknown-dev";

      const fileExt = file.name.split('.').pop().toLowerCase();
      const sanitizedFileName = file.name.replace(/\s+/g, '-').toLowerCase();
      const filePath = `manual-review/${githubUsername}/${Date.now()}-${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from('developer-assets') 
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileExt === 'zip' ? 'application/zip' : 'text/html',
        });

      if (error) throw error;

      Alert.alert("Success", "Game submitted to review queue.");
      console.log("Admin Review Path:", filePath);

    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. GitHub Repository Import Logic
  const handleGitImport = async () => {
    if (!gitUrl.includes('github.com')) {
      Alert.alert("Invalid URL", "Please enter a valid GitHub repository URL.");
      return;
    }

    setUploading(true);
    try {
      const baseUrl = gitUrl.replace(/\/$/, ""); 
      const zipUrl = `${baseUrl}/archive/refs/heads/main.zip`;

      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error("Could not fetch repo. Ensure it is public and 'main' branch exists.");
      }
      
      const blob = await response.blob();
      const githubUsername = auth.currentUser?.reloadUserInfo?.screenName || "git-importer";
      const repoName = baseUrl.split('/').pop();
      const filePath = `manual-review/${githubUsername}/${Date.now()}-${repoName}.zip`;

      const { error } = await supabase.storage
        .from('developer-assets')
        .upload(filePath, blob, {
          contentType: 'application/zip',
          upsert: false,
        });

      if (error) throw error;

      Alert.alert("Success", `Imported ${repoName} from GitHub.`);
      setGitUrl('');
    } catch (error) {
      console.error("Git Import Error:", error);
      Alert.alert("Import Failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Admin Console</Text>
          <Text style={styles.title}>
            Hello, <Text style={styles.accent}>{user?.displayName?.split(' ')[0] || 'Dev'}</Text>
          </Text>
        </View>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Main Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Upload from your device.</Text>
        <Pressable 
          style={[styles.uploadBox, uploading && { opacity: 0.6 }]} 
          onPress={handleFileUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#ec4899" size="large" />
          ) : (
            <>
              <View style={styles.uploadCircle}>
                <Text style={{ fontSize: 24 }}>📦</Text>
              </View>
              <Text style={styles.uploadTitle}>Click to select file</Text>
              <Text style={styles.uploadSubtitle}>Supports .zip (HTML5) or standalone .html</Text>
              <Text style={[styles.uploadSubtitle, { color: '#ec4899', marginTop: 8 }]}>
                Max size: 500MB
              </Text>
            </>
          )}
        </Pressable>

        {/* Git Import Section */}
        <Text style={[styles.sectionLabel, { marginTop: 40 }]}>Import from GitHub. (COMING SOON)</Text>
        <View style={styles.gitInputRow}>
            <TextInput
                style={styles.textInput}
                value={gitUrl}
                onChangeText={setGitUrl}
                placeholder="https://github.com/user/repo"
                placeholderTextColor="#64748b"
                // editable={!uploading}
                editable={false}
            />
            <Pressable
              style={[styles.importBtn, uploading && { opacity: 0.5 }]}
              onPress={handleGitImport}
              // disabled={uploading}
              disabled={true}
            >
                {uploading ? (
                  <ActivityIndicator color="#94a3b8" size="small" />
                ) : (
                  <Text style={styles.signOutText}>Import</Text>
                )}
            </Pressable>
        </View>
      </View>

      {/* Dashboard Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Active Games</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>In Review</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 24, paddingTop: 60, maxWidth: 800, alignSelf: 'center', width: '100%' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  kicker: { color: '#94a3b8', fontSize: 12, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff' },
  accent: { color: '#ec4899' },
  signOutBtn: {
    paddingHorizontal: 16,
    backgroundColor: '#c94487',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  signOutText: { color: '#ffffff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  section: { marginBottom: 32 },
  sectionLabel: { color: '#cbd5f5', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  uploadBox: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(236, 72, 153, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  uploadSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },
  gitInputRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  textInput: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 14,
  },
  importBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7f2753',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 20 },
  statCard: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statValue: { color: '#ffffff', fontSize: 28, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 4, letterSpacing: 1 },
});