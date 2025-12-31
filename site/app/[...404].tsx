import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Stack, router } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function NotFoundScreen() {
  // Animation for floating "404"
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Float up and down continuously
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-redirect after 5s
    const timer = setTimeout(() => {
      router.push('/play');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.code,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          404
        </Animated.Text>
        <Text style={styles.message}>
          Oops! The page you are looking for does not exist.
        </Text>
        <Pressable style={styles.button} onPress={() => router.push('/play')}>
          <Text style={styles.buttonText}>Go Home →</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  code: {
    fontSize: 72,
    fontWeight: '900',
    color: '#f65c5c',
    marginBottom: 24,
    textShadowColor: '#ec4899',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  message: {
    fontSize: 20,
    color: '#f6ec5c',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#ec4899',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
});
