import React, { useEffect, useRef } from 'react';
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

type DecorEvent = 'halloween' | 'christmas' | 'easter' | 'stpatricks' | 'new-year';

interface GameProps {
  name: string;
  imageSource: string; // key for gameIcons map
  onPress: () => void;
  decor?: DecorEvent;
  newUntil?: number; // YYMMDDHH format
  pcOnly?: boolean;
  legacy?: boolean;
  leaving?: string;
}

export function Game({
  name,
  imageSource,
  onPress,
  decor,
  newUntil,
  pcOnly,
  legacy,
  leaving,
}: GameProps) {
  const icon: ImageSourcePropType = gameIcons[imageSource];
  let decorIcon: ImageSourcePropType | null = null;

  /** 🏆 Awards (Top 10) */
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

  // Handle Decor Logic
  if (decor && decorIcons[decor]) {
    const options = decorIcons[decor];
    decorIcon = options[Math.floor(Math.random() * options.length)];
  }

  if (!icon) return null;

  // Badge Logic
  const showNewBadge = (() => {
    if (!newUntil) return false;
    const year = 2000 + Math.floor(newUntil / 1000000);
    const month = Math.floor((newUntil % 1000000) / 10000) - 1;
    const day = Math.floor((newUntil % 10000) / 100);
    const hour = newUntil % 100;
    const expireTime = new Date(year, month, day, hour).getTime();
    return Date.now() < expireTime;
  })();

  return (
    <View style={{ position: 'relative', margin: 5 }}>
      {decorIcon && <Image source={decorIcon} style={styles.decor} />}

      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={icon} style={styles.image} />
        </View>
          {/* Status Badges */}
          {showNewBadge && (
            <Text style={styles.newBadge}>NEW</Text>
          )}
          {pcOnly && (
            <Text style={styles.pcBadge}>PC</Text>
          )}

          {/* Award Badge: Logic Fixed Here */}
          {!legacy && awardBadge && (
            <Animated.View
              style={[
                styles.awardBadge,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.awardText}>{awardBadge}</Text>
            </Animated.View>
          )}
          {!legacy && leaving && (
            <Animated.View
              style={[
                styles.awardBadge,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
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
    backgroundColor: '#383b3a', // Hex equivalent of your rgb
    borderRadius: 24,
    alignItems: 'center',
    padding: 10,
    // Note: Elevation/Shadow only works if container has a background
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