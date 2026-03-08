import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/context/store';

export default function App() {
  const init = useStore(s => s.init);
  const hydrated = useStore(s => s.hydrated);

  const [fontsLoaded, fontError] = useFonts(
    Platform.OS === 'web'
      ? {}
      : {
          Nunito_400Regular:    require('./assets/fonts/Nunito-Regular.ttf'),
          Nunito_600SemiBold:   require('./assets/fonts/Nunito-SemiBold.ttf'),
          Nunito_700Bold:       require('./assets/fonts/Nunito-Bold.ttf'),
          Nunito_800ExtraBold:  require('./assets/fonts/Nunito-ExtraBold.ttf'),
          Nunito_900Black:      require('./assets/fonts/Nunito-Black.ttf'),
          SpaceMono_400Regular: require('./assets/fonts/SpaceMono-Regular.ttf'),
          SpaceMono_700Bold:    require('./assets/fonts/SpaceMono-Bold.ttf'),
        }
  );

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, []);

  if (fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F14', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', padding: 20 }}>Error: {fontError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F14', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C6AF7" size="large" />
      </View>
    );
  }

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F14', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C6AF7" size="large" />
        <Text style={{ color: '#8888AA', marginTop: 12, fontSize: 14 }}>Conectando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#0F0F14' }}>
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}