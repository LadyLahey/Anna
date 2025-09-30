import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import TapTiming from '../minigames/TapTiming';
import MemeMatch from '../minigames/MemeMatch';
import { addXp, getPet, savePet, xpForAction } from '../state/petState';

export default function MinigamesScreen() {
	const [mode, setMode] = React.useState<'menu' | 'tap' | 'match'>('menu');
	const [lastImage, setLastImage] = React.useState<string | undefined>(undefined);

	const award = async (winValue: number) => {
		const p = await getPet();
		if (!p) return;
		const base = xpForAction('MINIGAME');
		const xp = base + (winValue - 1) * 2;
		await savePet(addXp(p, xp));
		Alert.alert('Minigame', `+${xp} XP`);
		setMode('menu');
	};

	if (mode === 'tap') return <View style={styles.container}><TapTiming onDone={award} /></View>;
	if (mode === 'match') return <View style={styles.container}><MemeMatch lastImage={lastImage} onDone={(win) => award(win ? 3 : 1)} /></View>;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Minigames</Text>
			<Pressable style={styles.btn} onPress={() => setMode('tap')}><Text style={styles.btnText}>Tap Timing</Text></Pressable>
			<Pressable style={styles.btn} onPress={() => setMode('match')}><Text style={styles.btnText}>Meme Match</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 12 },
	btn: { backgroundColor: '#334155', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginRight: 8, marginTop: 8 },
	btnText: { color: 'white', fontWeight: '700' }
});

