import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Game } from '../assets/components/Game';
import slugMap from './uuids';

const decal = 'new-year';

const LS_FAVS = 'sparkly:favs';
const LS_RECENT = 'sparkly:recent';

type GameTuple = [name: string, img: string, uri: string, horror?: boolean];

const ALL_GAMES: GameTuple[] = [
  ['A Dance of Fire and Ice', 'ad', 'adofai'],
  ['A Small World Cup', 'ag', 'a-small-world-cup'],
  ['Adventure Drivers', 'ae', 'adventure-drivers'],
  ['Basket Random', 'ac', 'ba-random'],
  ['BitLife', '6', 'bitlife'],
  ['Block Blast', 'aa', 'blockblast'],
  ['Bloons Tower Defence 5', 'm', 'btd'],
  ['Boxing Random', 'ab', 'bo-random'],
  ['Cookie Clicker', 'ao', 'cookie-clicker'],
  ['Crazy Crash Landing', 'n', 'ccl'],
  ['Crashy Road', 'j', 'crashy-road'],
  ['Darts Pro', 'f', 'darts'],
  ['Draw Climber', 'g', 'draw-climb'],
  ['Drive Mad', '9', 'drive-mad'],
  ['Duck Duck Clicker', '4', 'duck-clicker'],
  ['Fast Runner', 't', 'fast-runner'],
  ['Flappy Bird', 'h', 'flappy-bird'],
  ['Five Nights at Freddy’s 1', 'a', 'f1', true],
  ['Five Nights at Freddy’s 2', 'ah', 'f2', true],
  ['Five Nights at Freddy’s 3', 'ai', 'f3', true],
  ['Geometry Dash 3D', 'o', 'gd3d'],
  ['Geometry Dash Wave', 'x', 'gdwv'],
  ['Geometry Dash Wave 3D', 'x', 'gdwv3d'],
  ['Gobble', 'r', 'gobble'],
  ['Google Games Baseball', 'y', 'gg-baseball'],
  ['Google Games Cricket', 'z', 'gg-cricket'],
  ['GunSpin', '8', 'gunspin'],
  ['Idle Football Manager', 'k', 'idle-foot'],
  ['Moto X3M 2', 'an', 'x3m-2'],
  ['NEW Tiny Fishing', '1', 'new-tiny-fishing'],
  ['Nut Sort', 'aj', 'nut-sort'],
  ['OvO', '7', 'ovo'],
  ['Paper.io 2', 'am', 'paper-io-2'],
  ['Penalty Kick Online', 'e', 'pens'],
  ['Plants vs Zombies', 'p', 'pvz'],
  ['Ragdoll Archers', '2', 'ragdoll-archers'],
  ['Ragdoll Hit', 'c', 'ragdoll-hit'],
  ['Roll', 'w', 'roll'],
  ['Roper', 'b', 'roper'],
  ['Slice Master', 'q', 'slice-master'],
  ['Soccer Random', 'ak', 'soccer-random'],
  ['Spiral Roll', 'i', 'spiral-roll'],
  ['Stack', 'v', 'stack'],
  ['Subway Surfers', '3', 'subway-surfers'],
  ['Survival Race', 'd', 'survival-race'],
  ['Tap Goal', 's', 'tap-goal'],
  ['There Is No Game', 'af', 'there-is-no-game'],
  ['Thorns and Balloons', '5', 'tabs'],
  ['Tiny Fishing', '1', 'tiny-fishing'],
  ['Volley Random', 'al', 'volley-random'],
  ['Wheelie Bike', 'l', 'wheelie-bike'],
  ['X3M Winter', '0', 'x3m-winter'],
  ['Drift Boss', 'u', 'drift-boss'],
  ['Swoop', 'ap', 'swoop'],
];

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [showHorror, setShowHorror] = useState(false);
  const [view, setView] = useState<'all' | 'favs' | 'recent'>('all');
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  /* animations */
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

  /* localStorage load */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const f = localStorage.getItem(LS_FAVS);
      const r = localStorage.getItem(LS_RECENT);
      if (f) setFavs(JSON.parse(f));
      if (r) setRecent(JSON.parse(r));
    } catch {}
  }, []);

  const saveFavs = (next: string[]) => {
    setFavs(next);
    if (typeof window !== 'undefined')
      localStorage.setItem(LS_FAVS, JSON.stringify(next));
  };

  const saveRecent = (next: string[]) => {
    setRecent(next);
    if (typeof window !== 'undefined')
      localStorage.setItem(LS_RECENT, JSON.stringify(next));
  };

  const toggleFav = (name: string) => {
    saveFavs(
      favs.includes(name)
        ? favs.filter(f => f !== name)
        : [...favs, name]
    );
  };

  const openGame = (name: string) => {
    const slug = ALL_GAMES[2];
    const uuid = slugMap[slug];
    if (!uuid) return;

    saveRecent([name, ...recent.filter(r => r !== name)].slice(0, 12));
    router.push(`/student/package/${uuid}/task/2/item/5`);
  };

  /* filter + sort */
  const games = useMemo(() => {
    let g = ALL_GAMES
      .filter(([, , , horror]) => showHorror || !horror)
      .filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));

    if (view === 'favs') g = g.filter(([n]) => favs.includes(n));
    if (view === 'recent') g = g.filter(([n]) => recent.includes(n));

    return g.sort((a, b) => a[0].localeCompare(b[0]));
  }, [query, showHorror, view, favs, recent]);

  /* responsive grid */
  const columns = width < 420 ? 2 : width < 900 ? 3 : 4;
  const itemWidth = Math.floor((width - 24) / columns);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sparkleGlow, { opacity: glowAnim }]} />

      <Image
        source={require(`@/assets/images/decal/${decal}-atmosphere.png`)}
        style={styles[decal]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.noticeBox, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.noticeTitle}>✨ Sparkly Games ✨</Text>
          <Text style={styles.noticeText}>v6.9.4 · 31/12/25</Text>
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

        <View style={styles.grid}>
          {games.map(([name, img]) => (
            <View key={name} style={{ width: itemWidth }}>
              <Game
                name={name}
                imageSource={img}
                decor={decal}
                onPress={() => openGame(name)}
              />
              <TouchableOpacity
                onPress={() => toggleFav(name)}
                style={styles.star}
              >
                <Ionicons
                  name={favs.includes(name) ? 'star' : 'star-outline'}
                  size={22}
                  color="#facc15"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* styles */
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

  noticeTitle: {
    color: '#f6ec5c',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  noticeText: {
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 6,
  },

  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#111827',
    color: 'white',
  },

  toggles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },

  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#1f2937',
  },

  toggleActive: { backgroundColor: '#ec4899' },
  toggleText: { color: 'white', fontWeight: '700' },

  horrorTxt: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#f87171',
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },

  star: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  'new-year': {
    height: 175,
    width: 400,
    top: 10,
    alignSelf: 'center',
  },
});
