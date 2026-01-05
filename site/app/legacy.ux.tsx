import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Image,
  Animated,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Head from 'expo-router/head';
import { Game } from '../assets/components/Game';
import gamesData from '../assets/data/games.json';
import { router } from 'expo-router';

export default function SparklyUnifiedUI() {
  const { width } = useWindowDimensions();

  // Functional States
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'all' | 'favs'>('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [modalGame, setModalGame] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // v7 Mechanisms (Subtle Animations)
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.5, duration: 4000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Favs Persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
  }, []);

  const toggleFav = (name: string) => {
    const next = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
    setFavs(next);
  };

  // Logic: All games now open in the Modal
  const handleGamePress = (game: any) => {
    setModalGame(game);
    setIframeKey(prev => prev + 1); // Reset iframe state for new game
  };

  const filteredGames = useMemo(() => {
    let g = gamesData
      .filter(g => showHorror || !g.horror)
      .filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
    return g.sort((a, b) => a.name.localeCompare(b.name));
  }, [query, showHorror, view, favs]);

  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Games - Legacy UX</title>
      </Head>        
      <View style={styles.toggles}>
          <TouchableOpacity onPress={() => router.push('/play')} style={styles.oldButton}>
            <Text style={styles.buttonText}>Return to New UX</Text>
          </TouchableOpacity>
        </View>

      {/* Subtle Glow Mechanism */}
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />
      

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Grid: Renders from gamesData.json */}
        <View style={styles.gameGrid}>
          {filteredGames.map(game => (
            <View key={game.name} style={styles.gameWrapper}>
              <Game
                name={game.name}
                imageSource={game.img}
                onPress={() => handleGamePress(game)}
                legacy
              />
            </View>
          ))}
        </View>
        <View style={styles.toggles}>
          <TouchableOpacity onPress={() => setShowHorror(!showHorror)} style={styles.oldButton}>
            <Text style={styles.buttonText}>{showHorror ? 'Hide Horror' : 'Show Horror'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Full Screen Popup Modal: Used for EVERY game */}
      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Text style={styles.modalX}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                  <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            {modalGame && (
              <iframe
                key={iframeKey}
                src={modalGame.url}
                style={{ flex: 1, width: '100%', border: 'none' }}
                allowFullScreen
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Classic Old UI Background
  container: { flex: 1, backgroundColor: '#2b2b2b' },
  scrollContent: { paddingVertical: 30, alignItems: 'center' },


  // Classic Blue Notice Box
  noticeBox: { 
    backgroundColor: '#001f3f', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 20, 
    width: '90%', 
    alignItems: 'center' 
  },
  noticeTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  noticeText: { color: 'white', textAlign: 'center', marginTop: 5 },

  search: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },

  toggles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, margin: 20 },

  // Classic Button Style
  oldButton: { 
    backgroundColor: '#444', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 8 
  },
  activeOldButton: { backgroundColor: '#F6C90E' },
  buttonText: { color: 'white', fontWeight: 'bold' },

  gameGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  gameWrapper: { margin: 5 },
  starIcon: { position: 'absolute', right: 8, top: 8 },

  'new-year': { position: 'absolute', height: 250, width: 400, top: 0, opacity: 0.7 },

  // Modal Styling
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '98%', height: '95%', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#1a1a1a' 
  },
  modalActions: { flexDirection: 'row', gap: 20 },
  modalX: { color: 'white', fontSize: 24, fontWeight: 'bold' },
});