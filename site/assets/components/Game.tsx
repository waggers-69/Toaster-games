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

type DecorEvent = 'halloween' | 'christmas' | 'easter' | 'stpatricks';

interface GameProps {
  name: string;
  imageSource: string; // key for gameIcons map
  onPress: () => void;
  decor?: DecorEvent;
  newUntil?: number; // YYMMDDHH format
  pcOnly?: boolean;
}

export function Game({
  name,
  imageSource,
  onPress,
  decor,
  newUntil,
  pcOnly,
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

  /** ✨ Badge animation */
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!awardBadge) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [awardBadge]);

  // Pick random decor if specified
  if (decor && decorIcons[decor]) {
    const options = decorIcons[decor];
    decorIcon = options[Math.floor(Math.random() * options.length)];
  }

  if (!icon) {
    console.error(
      `Error: No image source found for game "${name}" (key: "${imageSource}")`
    );
    return null;
  }

  // Determine if "New" badge should show
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

          {awardBadge && (
            <Animated.View
              style={[
                styles.awardBadge,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.awardText}>{awardBadge}</Text>
            </Animated.View>
          )}

          {showNewBadge && (
            <Text style={styles.newBadge}>NEW</Text>
          )}

          {pcOnly && (
            <Text style={styles.pcBadge}>PC</Text>
          )}
        </View>

        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgb(56,59,58)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    padding: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  decor: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    zIndex: 300,
  },
  text: {
    marginTop: 10,
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  newBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#00d084',
    color: 'white',
    fontWeight: '700',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    textTransform: 'uppercase',
    zIndex: 20,
  },
  pcBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: '#4b9eff',
    color: 'white',
    fontWeight: '700',
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    textTransform: 'uppercase',
    zIndex: 20,
  },
  awardBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#cbcbcbff',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    zIndex: 30,
  },
  awardText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2a2a2a',
  },
});
