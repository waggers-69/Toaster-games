import { Stack } from "expo-router";
import TeamsHeaderButton from '@/components/TeamsButton';
import SparxHeaderButton from "@/components/SparxButton";
import { Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Banner } from "@/components/Banner";
// @ts-ignore: allow importing image assets without explicit module declarations
// import fazber from '@/assets/images/feddy-fazber.jpg';
const fazber = ""
// @ts-ignore: allow importing image assets without explicit module declarations
import LogoImageSource from '@/assets/images/og12_logo_banner.png';

const HeaderLogo = () => (
  <Image
    style={styles.headerImage}
    source={LogoImageSource}
    resizeMode="contain"
  />
);

export default function RootLayout({ initialBanner }: { initialBanner?: boolean }) {
  const [showBanner, setShowBanner] = useState(false);
  const [desktopAdUrl, setDesktopAdUrl] = useState<string | null>(null);
  const [mobileAdUrl, setMobileAdUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Determine ad URLs based on environment
    const desktopId = "27974103";
    const mobileId = "27974202";
    const desktopIdDev = "27974499";
    const mobileIdDev = "27974532";

    if (initialBanner) {
      if (window.location.hostname.includes('devtunnels.ms')) {
        setDesktopAdUrl(`https://adserver.adsterra.com/${desktopIdDev}`);
        setMobileAdUrl(`https://adserver.adsterra.com/${mobileIdDev}`);
      } else {
        setDesktopAdUrl(`https://adserver.adsterra.com/${desktopId}`);
        setMobileAdUrl(`https://adserver.adsterra.com/${mobileId}`);
      }
      setShowBanner(true);
    }
  }, [initialBanner]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1 in 250 chance to replace the body with the fazber image
    if (Math.random() >= 1 / 250) return;

    const resolveSrc = (): string | undefined => {
      try {
        // Try React Native's resolver (works with numeric ids and module objects)
        // @ts-ignore
        const resolved = Image.resolveAssetSource?.(fazber);
        if (resolved && resolved.uri) return resolved.uri;
      } catch (e) {
        // ignore
      }

      // If import produced an object with a uri property
      if (fazber && typeof fazber === 'object' && 'uri' in (fazber as any)) {
        return (fazber as any).uri;
      }

      // fallback: string conversion (may be a URL already)
      return String(fazber || '');
    };

    const src = resolveSrc();
    if (!src) return;

    document.body.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; object-fit: contain;" />`;
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      {showBanner && desktopAdUrl && mobileAdUrl && (
        <Banner desktopAdUrl={desktopAdUrl} mobileAdUrl={mobileAdUrl} />
      )}
      <Stack
        screenOptions={{
          headerLeft: () => (
            <>
              <Text style={styles.iconTxt} onPress={() => window.location.href = '/'}>⌂</Text>
              <Text style={styles.iconTxt} onPress={() => window.location.reload()}>⟳</Text>
            </>
          ),
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: 'rgba(30, 30, 30, 1)' },
          headerTitleStyle: { color: 'white' },
          headerRight: () => (
            <>
              <SparxHeaderButton />
              <TeamsHeaderButton />
            </>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{ 
            // headerTitle: HeaderLogo,
            headerTitle: '✨ Sparkly ✨',
          }}>
          </Stack.Screen>
      </Stack>
    </>
  );
}

// --- Styles for the Header Image ---
const styles = StyleSheet.create({
  headerImage: { width: 150*1.5, height: 40*1.5, borderRadius: 25, opacity: 0.8 },
  iconTxt: { color: 'white', fontSize: 36, margin: 15 }
});