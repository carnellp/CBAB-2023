/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// React Native Default
import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Imported Node Modules
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Custom Components
import HomeScreen from './src/Screens/HomeScreen';
import ArticleTypeScreen from './src/Screens/ArticleTypeScreen';
import ArticleScreen from './src/Screens/ArticleScreen';
import BurgerScreen from './src/Screens/BurgerMenu';
import CustomStaticPage from './src/Screens/CustomStaticPage';
import BestPracticeScreen from './src/Screens/BestPracticeScreen';
import UploadBestPracticeScreen from './src/Screens/UploadBestPracticeScreen';
import BestPracticeItemScreen from './src/Screens/BestPracticeItemScreen';


const Stack = createStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ArticleTypeScreen" component={ArticleTypeScreen} />
        <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
        <Stack.Screen
          name="BestPracticeScreen"
          component={BestPracticeScreen}
        />
        <Stack.Screen
          name="BestPracticeItemScreen"
          component={BestPracticeItemScreen}
        />
        <Stack.Screen
          name="UploadBestPracticeScreen"
          component={UploadBestPracticeScreen}
        />
        <Stack.Screen name="CustomStaticPage" component={CustomStaticPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
