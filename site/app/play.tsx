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
import { gamesData } from '../assets/data/games';
import { analytics } from '@/public/firebaseConfig.js';
import { ChaosImage } from '@/assets/components/ChaosImage';

const decal = 'new-year';
const LS_FAVS = 'sparkly:favs';
const LS_RECENT = 'sparkly:recent';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  /* ---------------- Bazinga ---------------- */
  const [bazingaMode, setBazingaMode] = useState(false);
  const [lang, setLang] = useState<'en' | 'tlh'>('en');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleBazinga = () => {
    setBazingaMode(prev => {
      const newMode = !prev;

      if (newMode) {
        // Turn ON Bazinga
        if (!audioRef.current) {
          audioRef.current = new Audio('/bazinga.mp3');
          audioRef.current.loop = true;
          audioRef.current.playbackRate = Math.random() + Math.random() * 1.25;
        }
        audioRef.current.play();
      } else {
        // Turn OFF Bazinga
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }

      setLang(l => (l === 'en' ? 'tlh' : 'en'));
      return newMode;
    });
  };

  // Simple wrapper
  const bazinga = () => toggleBazinga();


  /* ---------------- Soundboard ---------------- */
  const soundboard = () => {
    setModalGame({
      title: { en: 'Soundboard', tlh: 'Soundboard' },
      url: '/soundboard.htm',
      soundboard: true,
    });
    setIframeKey(k => k + 1);
  };

  /* ---------------- State ---------------- */
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'all' | 'favs' | 'recent'>('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [showHorror, setShowHorror] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [modalGame, setModalGame] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0);

  /* ---------------- Animations ---------------- */
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

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

  /* ---------------- Local Storage ---------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f = localStorage.getItem(LS_FAVS);
    const r = localStorage.getItem(LS_RECENT);
    if (f) setFavs(JSON.parse(f));
    if (r) setRecent(JSON.parse(r));
  }, []);
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        /* Safari/iOS Support */
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) {
        /* IE11 Support */
        (iframeRef.current as any).msRequestFullscreen();
      }
    }
  };
  const saveFavs = (next: string[]) => {
    setFavs(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_FAVS, JSON.stringify(next));
  };

  const saveRecent = (next: string[]) => {
    setRecent(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_RECENT, JSON.stringify(next));
  };

  const toggleFav = (name: string) => saveFavs(favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name]);

  const openGame = (game: any) => {
    saveRecent([game.name, ...recent.filter(r => r !== game.name)].slice(0, 12));
    setModalGame(game);
    setIframeKey(k => k + 1);
  };

  /* ---------------- Filter Games ---------------- */
  const games = useMemo(() => {
    let g = gamesData
      .filter(g => showHorror || !g.horror)
      .filter(g => showPC || !g.pc)
      .filter(g => g.title.en.toLowerCase().includes(query.toLowerCase()));

    if (view === 'favs') g = g.filter(g => favs.includes(g.title.en));
    if (view === 'recent') g = g.filter(g => recent.includes(g.title.en));

    return g.sort((a, b) => a.title.en.localeCompare(b.title.en));
  }, [query, showHorror, showPC, view, favs, recent]);

  const columns = width < 420 ? 2 : width < 900 ? 3 : 4;
  const itemWidth = Math.floor((width - 24) / columns);

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.container}>
      <Head>
        <title>Sparkly Games</title>
      </Head>

      {/* Glow Effect */}
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />

      {/* Atmosphere Decal */}
      <ChaosImage
        source={require(`../assets/images/decal/${decal}-atmosphere.png`)}
        style={styles[decal]}
        bazinga={bazingaMode}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notice Box */}
        <Animated.View style={[styles.noticeBox, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.noticeTitle}>✨ Sparkly Games ✨</Text>
          <Text style={[styles.noticeText, { fontWeight: 'bold' }]}>
            {bazingaMode ? 'UBGU chut' : 'Officially joining the UBGU!'}
          </Text>
          <Text style={styles.noticeText}>v7.2.4 · 18/01/26</Text>
          <View style={{ height: 24, flexDirection: 'row', gap: 12 }} >
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sparkly-games')}>
              <Ionicons name="logo-octocat" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if(window.location.hostname !== "localhost") window.location.href = '/docs'; else {window.location.href = 'http://localhost:3000/docs'} }}>
              <Ionicons name="document-attach-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/vids')}>
              <Ionicons name="logo-youtube" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={bazinga}>
              <Ionicons name="logo-electron" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={soundboard}>
              <Ionicons name="clipboard-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/sparkly-dev')}>
              <Ionicons name="code" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={bazingaMode ? 'quj nej…' : 'Search games…'}
          style={styles.search}
        />

        {/* Toggles */}
        <View style={styles.toggles}>
          {['all', 'favs', 'recent'].map(v => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v as any)}
              style={[styles.toggle, view === v && styles.toggleActive]}
            >
              <Text style={styles.toggleText}>
                {v === 'all' ? (bazingaMode ? 'pagh' : 'All') :
                 v === 'favs' ? (bazingaMode ? 'yInlu' : 'Favourites') :
                 bazingaMode ? 'QIn' : 'Recent'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => setShowHorror(!showHorror)}>
          <Text style={styles.horrorTxt}>{showHorror ? (bazingaMode ? 'ghItlh Horror' : 'Hide Horror') : (bazingaMode ? 'Qagh Horror' : 'Show Horror')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPC(!showPC)}>
          <Text style={styles.horrorTxt}>{showPC ? (bazingaMode ? 'ghItlh PC' : 'Hide PC') : (bazingaMode ? 'Qagh PC' : 'Show PC')}</Text>
        </TouchableOpacity>

        {/* Leaving Soon */}
        { games.some(g => g.leaving) && (
          <Text style={styles.sectionTitle}>{bazingaMode ? 'yItlhutlh qet' : 'Leaving Soon'}</Text>
        )}
        <View style={styles.grid}>
          {games.filter(game => game.leaving).map(game => (
            <View key={game.title.en} style={{ width: itemWidth }}>
              <Game
                name={bazingaMode ? game.title.tlh ?? game.title.en : game.title.en}
                imageSource={game.img}
                decor={decal}
                leaving={game.leaving}
                onPress={() => openGame(game)}
                bazinga={bazingaMode}
              />
              <TouchableOpacity onPress={() => toggleFav(game.title.en)} style={styles.star}>
                <Ionicons name={favs.includes(game.title.en) ? 'star' : 'star-outline'} size={22} color="#facc15" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* All Games */}
        <Text style={styles.sectionTitle}>{bazingaMode ? 'Qap' : 'Games'}</Text>
        <View style={styles.grid}>
          {games.filter(game => !game.leaving).map(game => (
            <View key={game.title.en} style={{ width: itemWidth }}>
              <Game
                name={bazingaMode ? game.title.tlh ?? game.title.en : game.title.en}
                imageSource={game.img}
                decor={decal}
                onPress={() => openGame(game)}
                bazinga={bazingaMode}
              />
              <TouchableOpacity onPress={() => toggleFav(game.title.en)} style={styles.star}>
                <Ionicons name={favs.includes(game.title.en) ? 'star' : 'star-outline'} size={22} color="#facc15" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!modalGame} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalGame(null)}>
                <Text style={styles.modalX}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFullscreen}>
                <Ionicons name="scan" size={28} color="white" />
              </TouchableOpacity>

              {modalGame?.title.en && !modalGame?.soundboard && (
                <TouchableOpacity onPress={() => toggleFav(modalGame.title.en)}>
                  <Ionicons name={favs.includes(modalGame.title.en) ? 'star' : 'star-outline'} size={28} color="#facc15" />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setIframeKey(k => k + 1)}>
                <Ionicons name="refresh" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={modalGame?.url}
              style={{ flex: 1, width: '100%', border: 'none' }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- Styles ---------------- */
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
  },
  'new-year': { height: 175, width: 400, top: 10, alignSelf: 'center' },

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
  sectionTitle: { color: '#ffffff', textAlign: 'center', marginBottom: 12, fontSize: 20, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  star: { position: 'absolute', right: 10, top: 10 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '95%', height: '90%', backgroundColor: '#111827', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, gap: 12 },
  modalX: { color: 'white', fontSize: 28, fontWeight: '900' },
});
