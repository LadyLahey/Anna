import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
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
				<View style={styles.headerRow}>
					<Text style={styles.petName}>{pet.name}</Text>
					{pet.mediaThumbUri ? <Image source={{ uri: pet.mediaThumbUri }} style={styles.thumb} /> : null}
				</View>
				<Text style={styles.petMeta}>Species: {pet.species}</Text>
				<Text style={styles.petMeta}>Stage: {pet.stage}</Text>
				<View style={styles.traitsRow}>
					{pet.traits.map(t => (
						<View key={t} style={styles.traitChip}><Text style={styles.traitText}>{t}</Text></View>
					))}
				</View>
			</View>
			<Pressable style={styles.button} onPress={() => navigation.navigate('PetProfile')}>
				<Text style={styles.buttonText}>Open Pet</Text>
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
	traitsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
	traitChip: { backgroundColor: '#1f2937', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
	traitText: { color: 'white', fontWeight: '700' },
	button: { marginTop: 20, backgroundColor: '#7c3aed', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	buttonText: { color: 'white', fontWeight: '800', fontSize: 16 },
	empty: { color: '#cbd5e1', fontSize: 16, marginBottom: 12 },
	headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	thumb: { width: 40, height: 40, borderRadius: 8 }
});

