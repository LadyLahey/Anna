import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HatchScreen from './src/screens/HatchScreen';
import FeedScreen from './src/screens/FeedScreen';
import RevealScreen from './src/screens/RevealScreen';
import StoreScreen from './src/screens/StoreScreen';
import { AppStateProvider } from './src/state/AppState';

export type RootStackParamList = {
	Hatch: undefined;
	Feed: undefined;
	Reveal: undefined;
	Store: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer theme={{...DefaultTheme}}>
				<AppStateProvider>
					<Stack.Navigator initialRouteName="Hatch" screenOptions={{ headerTitle: 'PetChaos' }}>
						<Stack.Screen name="Hatch" component={HatchScreen} />
						<Stack.Screen name="Feed" component={FeedScreen} />
						<Stack.Screen name="Reveal" component={RevealScreen} />
						<Stack.Screen name="Store" component={StoreScreen} />
					</Stack.Navigator>
				</AppStateProvider>
			</NavigationContainer>
			<StatusBar style="light" />
		</SafeAreaProvider>
	);
}

