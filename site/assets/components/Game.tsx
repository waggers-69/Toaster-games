import React, { useEffect, useRef, useMemo } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  View,
  Animated,
} from 'react-native';
import { decorIcons } from '@/assets/images/DecorIcons';
import { gameIcons } from '@/assets/data/GameIcons';

type DecorEvent = 'halloween' | 'christmas' | 'new-year';

interface GameProps {
  name: string; // Already translated to the current language
  imageSource: string; // key for gameIcons map
  onPress: () => void;
  decor?: DecorEvent;
  newUntil?: number; // YYMMDDHH
  pcOnly?: boolean;
  legacy?: boolean;
  leaving?: string;
  bazinga?: boolean; // NEW: toggle chaos images
}

const CHAOS: ImageSourcePropType[] = [
  require('@/assets/images/chaos/1.jpg'),
  require('@/assets/images/chaos/2.jpg'),
  require('@/assets/images/chaos/3.jpg'),
  require('@/assets/images/chaos/4.jpg'),
  require('@/assets/images/chaos/5.webp'),
];
const DOG = require('@/assets/images/dog.jpeg');

export function Game({
  name,
  imageSource,
  onPress,
  decor,
  newUntil,
  pcOnly,
  legacy,
  leaving,
  bazinga = false,
}: GameProps) {
  const icon: ImageSourcePropType = gameIcons[imageSource];

  /** 🏆 Awards */
  const awards: Record<string, string> = {
    ad: '🎖️ 2025',
    '6': '🥇 2025',
    a: '🥈 2025',
    '1': '🥉 2025',
    x: '🎖️ 2025',
    c: '🎖️ 2025',
    ag: '🎖️ 2025',
    p: '🎖️ 2025',
    '8': '🎖️ 2025',
    l: '🎖️ 2025',
  };
  const awardBadge = awards[imageSource] ?? null;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!awardBadge) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [awardBadge]);

  // Decor icon logic
  let decorIcon: ImageSourcePropType | null = null;
  if (decor && decorIcons[decor]) {
    const options = decorIcons[decor];
    decorIcon = options[Math.floor(Math.random() * options.length)];
  }

  if (!icon) return null;

  // NEW: Randomized image when Bazinga is ON
  const finalImage = useMemo(() => {
    if (!bazinga) return icon;
    if (Math.floor(Math.random() * 1000) === 0) return DOG;
    return CHAOS[Math.floor(Math.random() * CHAOS.length)];
  }, [bazinga]);

  // Badge logic
  const showNewBadge = (() => {
    if (!newUntil) return false;
    const year = 2000 + Math.floor(newUntil / 1000000);
    const month = Math.floor((newUntil % 1000000) / 10000) - 1;
    const day = Math.floor((newUntil % 10000) / 100);
    const hour = newUntil % 100;
    return Date.now() < new Date(year, month, day, hour).getTime();
  })();

  return (
    <View style={{ position: 'relative', margin: 5 }}>
      {decorIcon && <Image source={decorIcon} style={styles.decor} />}
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={finalImage} style={styles.image} />
        </View>

        {showNewBadge && <Text style={styles.newBadge}>NEW</Text>}
        {pcOnly && <Text style={styles.pcBadge}>PC</Text>}

        {!legacy && awardBadge && (
          <Animated.View style={[styles.awardBadge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.awardText}>{awardBadge}</Text>
          </Animated.View>
        )}

        {!legacy && leaving && (
          <Animated.View style={[styles.awardBadge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.awardText}>Last day to play: {leaving}</Text>
          </Animated.View>
        )}

        <Text style={styles.text} numberOfLines={1}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#383b3a',
    borderRadius: 24,
    alignItems: 'center',
    padding: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  decor: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 35,
    height: 35,
    zIndex: 300,
  },
  text: {
    marginTop: 8,
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 120,
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#00d084',
    color: 'white',
    fontWeight: '800',
    fontSize: 9,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  pcBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#4b9eff',
    color: 'white',
    fontWeight: '800',
    fontSize: 9,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 20,
    overflow: 'hidden',
  },
  awardBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#cbcbcb',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    zIndex: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  awardText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#2a2a2a',
  },
});
