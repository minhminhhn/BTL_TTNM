import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import React, {useCallback, useState, useEffect} from 'react'

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import Navigation from './components/Navigation'
import Study from './screen/Study';
import SearchResult from './screen/SearchResult';
import Quiz from './screen/Quiz';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        SplashScreen.preventAutoHideAsync();

        const imageAssets = cacheImages([
          require('./assets/images/banner.png'),
          require('./assets/images/logo.png')
        ]);

        await Font.loadAsync({
          'feather': require('./assets/font/feather_bold_by_typicalbro44_dee263c.ttf'),
          'Montserrat': require('./assets/font/Montserrat-Regular.ttf'),
          'Poppins': require('./assets/font/Poppins-Bold.ttf')
        });

        await Promise.all([...imageAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Navigation"
          options={{animationEnabled: true, header: () => null}}
          component={Navigation}
        />
        <Drawer.Screen
          name="Study"
          options={{animationEnabled: true, header: () => null}}
          component={Study}
        />
        <Drawer.Screen
          name="SearchResult"
          options={{animationEnabled: true, header: () => null}}
          component={SearchResult}
        />
        <Drawer.Screen
          name="Quiz"
          options={{animationEnabled: true, header: () => null}}
          component={Quiz}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}