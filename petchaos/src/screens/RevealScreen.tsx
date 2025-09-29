import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppState } from '../state/AppState';

type Props = NativeStackScreenProps<RootStackParamList, 'Reveal'>;

export default function RevealScreen({ navigation }: Props) {
	const { pet } = useAppState();

	if (!pet) {
		return (
			<View style={styles.container}>
				<Text style={styles.empty}>No pet yet. Go hatch one!</Text>
				<Pressable style={styles.button} onPress={() => navigation.replace('Hatch')}>
					<Text style={styles.buttonText}>Back to Hatch</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>🎉 Your Pet Appears!</Text>
			<View style={styles.card}>
				<Text style={styles.petName}>{pet.name}</Text>
				<Text style={styles.petMeta}>Species: {pet.species}</Text>
				<Text style={styles.petMeta}>Stage: {pet.stage}</Text>
				<Text style={styles.petTraits}>Traits: {pet.traits.join(', ')}</Text>
			</View>
			<Pressable style={styles.button} onPress={() => navigation.navigate('Store')}>
				<Text style={styles.buttonText}>Go to Store</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 24, fontWeight: '700', marginTop: 24, marginBottom: 12 },
	card: { backgroundColor: '#0b1220', borderColor: '#1f2937', borderWidth: 1, padding: 16, borderRadius: 12 },
	petName: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 },
	petMeta: { color: '#cbd5e1', marginBottom: 4 },
	petTraits: { color: '#a1a1aa', marginTop: 8 },
	button: { marginTop: 20, backgroundColor: '#7c3aed', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	buttonText: { color: 'white', fontWeight: '800', fontSize: 16 },
	empty: { color: '#cbd5e1', fontSize: 16, marginBottom: 12 }
});

