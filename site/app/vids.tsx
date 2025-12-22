import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface VideoCard {
  id: string;
  title: string;
  thumbnail: any; // Local assets use 'any' or 'ImageSourcePropType'
}

const sampleVideos: VideoCard[] = [
  {
    id: 'stealth-thorpe-park',
    title: 'Stealth | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/stealth.jpg'), // Ensure file extensions match your assets
  },
  {
    id: 'colossus-thorpe-park',
    title: 'Colossus | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/colossus.jpg'), // Ensure file extensions match your assets
  },
  {
    id: 'saw-thorpe-park',
    title: 'Saw | Thorpe Park 2023 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-thorpe-park/saw.jpg'), // Ensure file extensions match your assets
  },
  {
    id: '13-thorpe-park',
    title: 'TH13TEEN | Alton Towers 2020 POV (360p)',
    thumbnail: require('@/assets/thumbnails/rc-alton-towers/13.webp'), // Ensure file extensions match your assets
  },
  {
    id: 'bazinga-tbbt',
    title: 'Bazinga | The Big Bang Theory S3E15 (360p)',
    thumbnail: require('@/assets/thumbnails/tbbt/bazinga.webp'), // Ensure file extensions match your assets
  },
];

export default function VideoGrid() {
  const handleVideoPress = (video: VideoCard) => {
    router.push(`/vidplayer/${video.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Videos</Text>
        </View>

        <View style={styles.gridContainer}>
          {sampleVideos.map((video) => (
            <TouchableOpacity 
              key={video.id} 
              style={styles.videoCard}
              onPress={() => handleVideoPress(video)}
            >
              <Image
                source={video.thumbnail}
                style={styles.thumbnail}
              />

              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  videoCard: {
    marginBottom: 24,
  },
  thumbnail: {
    width: 360,
    height: 180,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  videoInfo: {
    paddingVertical: 4,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});