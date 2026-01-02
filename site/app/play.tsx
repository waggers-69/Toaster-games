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
  Linking,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Game } from '../assets/components/Game';
import gamesData from '../assets/data/games.json';

const decal = 'new-year';
const LS_FAVS = 'sparkly:favs';
const LS_RECENT = 'sparkly:recent';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [view, setView] = useState<'all' | 'favs' | 'recent'>('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);

  const [modalGame, setModalGame] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0); // to force refresh

  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  /* Animations */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.75, duration: 3000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* Load favs + recent */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const f = localStorage.getItem(LS_FAVS);
    const r = localStorage.getItem(LS_RECENT);
    if (f) setFavs(JSON.parse(f));
    if (r) setRecent(JSON.parse(r));
  }, []);

  const saveFavs = (next: string[]) => {
    setFavs(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_FAVS, JSON.stringify(next));
  };

  const saveRecent = (next: string[]) => {
    setRecent(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_RECENT, JSON.stringify(next));
  };

  const toggleFav = (name: string) => {
    saveFavs(favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name]);
  };

  const openGame = (game: any) => {
    saveRecent([game.name, ...recent.filter(r => r !== game.name)].slice(0, 12));
    setModalGame(game);
    setIframeKey(k => k + 1); // reset iframe
  };

  const games = useMemo(() => {
    let g = gamesData
      .filter(g => showHorror || !g.horror)
      .filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

    if (view === 'favs') g = g.filter(g => favs.includes(g.name));
    if (view === 'recent') g = g.filter(g => recent.includes(g.name));

    return g.sort((a, b) => a.name.localeCompare(b.name));
  }, [query, showHorror, view, favs, recent]);

  const columns = width < 420 ? 2 : width < 900 ? 3 : 4;
  const itemWidth = Math.floor((width - 24) / columns);

  return (
    <View style={styles.container}>
      <Head>
          <title>Sparkly Games</title>
          <meta name="description" content="With Sparkly, get ready to game into the future. With a huge catalog of games to choose from, and even more to come, we hope you never get bored. With no ads and more games every other day, you'll never be bored!" />
      </Head>
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />

      <Image
        source={require(`../assets/images/decal/${decal}-atmosphere.png`)}
        style={styles[decal]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sparkly Games Header */}
        <Animated.View style={[styles.noticeBox, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.noticeTitle}>✨ Sparkly Games ✨</Text>
          <Text style={styles.noticeText}>v6.9.8 · 02/01/26</Text>
          <Text style={styles.noticeText}>Search · Favourites · Recent · A–Z</Text>
        </Animated.View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search games…"
          placeholderTextColor="#9ca3af"
          style={styles.search}
        />

        <View style={styles.toggles}>
          {['all', 'favs', 'recent'].map(v => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v as any)}
              style={[styles.toggle, view === v && styles.toggleActive]}
            >
              <Text style={styles.toggleText}>
                {v === 'all' ? 'All' : v === 'favs' ? 'Favourites' : 'Recent'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.horrorTxt}>
            {showHorror ? 'Hide Horror' : 'Show Horror'}
          </Text>
        </TouchableOpacity>

        {/* Games Grid */}
        <View style={styles.grid}>
          {games.map(game => (
            <View key={game.name} style={{ width: itemWidth }}>
              <Game
                name={game.name}
                imageSource={game.img}
                decor={decal}
                onPress={() => openGame(game)}
              />
              <TouchableOpacity onPress={() => toggleFav(game.name)} style={styles.star}>
                <Ionicons
                  name={favs.includes(game.name) ? 'star' : 'star-outline'}
                  size={22}
                  color="#facc15"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            {/* Close + Fav + Refresh */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Text style={styles.modalX}>✕</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => modalGame && toggleFav(modalGame.name)}>
                <Ionicons
                  name={favs.includes(modalGame?.name) ? 'star' : 'star-outline'}
                  size={28}
                  color="#facc15"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                <Ionicons name="refresh" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <iframe
              key={iframeKey}
              src={modalGame?.url}
              style={{ flex: 1, width: '100%', border: 'none' }}
            />
          </View>
        </View>
      </Modal>

      {/* Social Icons Vertical */}
      <View style={styles.socials}>
        <Ionicons
          name="logo-octocat"
          size={28}
          color="white"
          onPress={() => Linking.openURL('https://github.com/sparkly-games')}
        />
        <Ionicons
          name="logo-youtube"
          size={28}
          color="white"
          onPress={() => router.push('/vids')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  scrollContent: { paddingBottom: 40 },
  sparkleGlow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: '#ec4899',
    top: -140,
    alignSelf: 'center',
    opacity: 0.5,
  },
  noticeBox: {
    margin: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  noticeTitle: { color: '#f6ec5c', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  noticeText: { color: '#e5e7eb', textAlign: 'center', marginTop: 6 },
  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#111827',
    color: 'white',
  },
  toggles: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  toggle: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#1f2937' },
  toggleActive: { backgroundColor: '#ec4899' },
  toggleText: { color: 'white', fontWeight: '700' },
  horrorTxt: { textAlign: 'center', marginBottom: 12, color: '#f87171', fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  star: { position: 'absolute', right: 10, top: 10 },
  'new-year': { height: 175, width: 400, top: 10, alignSelf: 'center' },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: '#111827',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    gap: 12,
  },
  modalX: { color: 'white', fontSize: 28, fontWeight: '900' },

  socials: {
    position: 'absolute',
    right: 10,
    top: 80,
    flexDirection: 'column',
    gap: 12,
  },
});
