import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HatchScreen from './src/screens/HatchScreen';
import FeedScreen from './src/screens/FeedScreen';
import RevealScreen from './src/screens/RevealScreen';
import StoreScreen from './src/screens/StoreScreen';
import PetProfileScreen from './src/screens/PetProfileScreen';
import MinigamesScreen from './src/screens/MinigamesScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import { AppStateProvider } from './src/state/AppState';

export type RootStackParamList = {
	Hatch: undefined;
	Feed: undefined;
	Reveal: undefined;
	Store: undefined;
	PetProfile: undefined;
	Minigames: undefined;
	Quests: undefined;
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
						<Stack.Screen name="PetProfile" component={PetProfileScreen} />
						<Stack.Screen name="Minigames" component={MinigamesScreen} />
						<Stack.Screen name="Quests" component={QuestsScreen} />
					</Stack.Navigator>
				</AppStateProvider>
			</NavigationContainer>
			<StatusBar style="light" />
		</SafeAreaProvider>
	);
}

