import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Hatch'>;

export default function HatchScreen({ navigation }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>🥚 Hatch Your Chaos</Text>
			<Text style={styles.subtitle}>Tap to begin your pet's unpredictable journey.</Text>
			<Pressable style={styles.button} onPress={() => navigation.navigate('Feed')}>
				<Text style={styles.buttonText}>Hatch</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 28, fontWeight: '700', marginBottom: 8 },
	subtitle: { color: '#cbd5e1', textAlign: 'center', marginBottom: 24 },
	button: { backgroundColor: '#7c3aed', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
	buttonText: { color: 'white', fontSize: 18, fontWeight: '700' }
});

