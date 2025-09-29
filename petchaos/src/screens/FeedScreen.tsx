import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { isTextSafe, sanitize } from '../services/filters';
import { generatePetFromText } from '../engine/petEngine';
import { useAppState } from '../state/AppState';

type Props = NativeStackScreenProps<RootStackParamList, 'Feed'>;

export default function FeedScreen({ navigation }: Props) {
	const [input, setInput] = useState('');
	const [error, setError] = useState<string | null>(null);
	const { setPet } = useAppState();

	const onGenerate = () => {
		const clean = sanitize(input);
		if (!clean) return setError('Please enter a short description or vibe.');
		if (!isTextSafe(clean)) return setError('That input looks unsafe. Try different words.');
		const pet = generatePetFromText(clean);
		setPet(pet);
		navigation.replace('Reveal');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>🍽️ Feed Input</Text>
			<Text style={styles.subtitle}>Describe a vibe, meme, or creature idea.</Text>
			<TextInput
				placeholder="e.g., sparkly cat with chaotic energy"
				placeholderTextColor="#64748b"
				value={input}
				onChangeText={t => { setInput(t); if (error) setError(null); }}
				style={styles.input}
				multiline
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<Pressable style={styles.button} onPress={onGenerate}>
				<Text style={styles.buttonText}>Reveal Pet</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 24, fontWeight: '700', marginTop: 24 },
	subtitle: { color: '#94a3b8', marginTop: 6, marginBottom: 16 },
	input: { backgroundColor: '#111827', color: 'white', padding: 12, borderRadius: 10, minHeight: 100, borderWidth: 1, borderColor: '#1f2937' },
	error: { color: '#fca5a5', marginTop: 8 },
	button: { marginTop: 16, backgroundColor: '#22c55e', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	buttonText: { color: '#052e16', fontWeight: '800', fontSize: 16 }
});

