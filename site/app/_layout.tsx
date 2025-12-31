import { router, Stack } from 'expo-router';
import TeamsHeaderButton from '@/assets/components/TeamsButton';
import SparxHeaderButton from '@/assets/components/SparxButton';
import { Text, Image, StyleSheet } from 'react-native';
import React from 'react';
// @ts-ignore
import LogoImageSource from '@/assets/images/sparkly_logo_banner.png';

const HeaderLogo = () => (
  <Image
    style={styles.headerImage}
    source={LogoImageSource}
    resizeMode="contain"
  />
);

export default function RootLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <Text style={styles.iconTxt} onPress={() => router.push('/play')}>
            ⌂
          </Text>
        ),
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: 'rgba(69,69,69,1)' },
        headerTitleStyle: { color: 'white' },
        headerRight: () => (
          <>
            <SparxHeaderButton />
            <TeamsHeaderButton />
          </>
        ),
        headerTitle: route.name === 'play' ? HeaderLogo : undefined,
        headerShown: route.name === 'index' ? false : true,
      })}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: { width: 225, height: 60, borderRadius: 25, opacity: 0.8 },
  iconTxt: { color: 'white', fontSize: 36, margin: 15 },
});
