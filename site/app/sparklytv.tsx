import React from 'react';
import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ComingSoon() {
  return (
    <LinearGradient
      colors={['#2a3783', '#6a3c00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <Image
        source={require('../assets/images/sparklytv.png')}
        style={{
          width: '100%',
          height: '45%',
          tintColor: 'grey',
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <Text 
            style={{
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 20,
        }}>
            Sparkly TV is Coming Soon!
      </Text>
    </LinearGradient>
  );
}

export const screenOptions = {
  headerShown: false,
};
