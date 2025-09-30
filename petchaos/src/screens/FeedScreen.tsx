import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { isTextSafe, sanitize } from '../services/filters';
import { generatePetFromText } from '../engine/petEngine';
import { savePet } from '../state/petState';
import { Pet as ProfilePet } from '../types/pet';
import FeedMedia, { MediaSelection } from '../components/FeedMedia';
import { analyzeImage } from '../services/ai/vision';
import { analyzeAudio } from '../services/ai/audio';
import { mixTraits } from '../services/petMixer';
import { pushHistory } from '../services/history';

type Props = NativeStackScreenProps<RootStackParamList, 'Feed'>;

export default function FeedScreen({ navigation }: Props) {
	const [input, setInput] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
    const [media, setMedia] = useState<MediaSelection>({});

	const onGenerate = async () => {
		const clean = sanitize(input);
		if (!clean && !media.imageUri && !media.audioUri) return setError('Type something or attach media.');
		if (clean && !isTextSafe(clean)) return setError('That input looks unsafe. Try different words.');

		setLoading(true);
		try {
            if (media.imageUri || media.audioUri) {
				const summary = media.imageUri ? await analyzeImage(media.imageUri) : await analyzeAudio(media.audioUri as string);
				const mix = mixTraits(summary);
				const seedText = clean || (summary.topics.join(' ') + ' ' + summary.keywords.join(' '));
                const base = generatePetFromText(seedText);
                const pet: ProfilePet = {
                    id: base.id,
                    species: mix.species,
                    stage: Math.min(3, base.stage + mix.stageDelta),
                    xp: 0,
                    level: 1,
                    stats: { hunger: 50, happiness: 50, energy: 50 },
                    traits: Array.from(new Set([...base.traits, ...mix.traits])),
                    lastFedAt: Date.now(),
                    mediaThumb: media.imageUri
                };
                await savePet(pet);
				await pushHistory({ createdAt: Date.now(), imageUri: media.imageUri, audioUri: media.audioUri, result: summary });
				navigation.replace('Reveal');
			} else {
                const base = generatePetFromText(clean);
                const pet: ProfilePet = {
                    id: base.id,
                    species: base.species,
                    stage: base.stage,
                    xp: 0,
                    level: 1,
                    stats: { hunger: 50, happiness: 50, energy: 50 },
                    traits: base.traits,
                    lastFedAt: Date.now()
                };
                await savePet(pet);
				navigation.replace('Reveal');
			}
		} catch (e) {
			setError('Analysis failed. Try again or use Mock Analysis.');
		} finally {
			setLoading(false);
		}
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
			<FeedMedia value={media} onChange={setMedia} />
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<Pressable style={styles.button} onPress={onGenerate} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? 'Your pet is munching on the meme…' : 'Reveal Pet'}</Text>
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

