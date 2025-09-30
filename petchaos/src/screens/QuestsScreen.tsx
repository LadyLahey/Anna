import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { claimQuestRewards, getTodayQuests, Quest } from '../quests/quests';
import { getPet } from '../state/petState';

export default function QuestsScreen() {
	const [quests, setQuests] = useState<Quest[]>([]);

	useEffect(() => { (async () => setQuests(await getTodayQuests()))(); }, []);

	const claim = async (q: Quest) => {
		const pet = await getPet();
		if (!pet) return;
		await claimQuestRewards(pet, q);
		Alert.alert('Quest', `Claimed +${q.rewardXp} XP${q.rewardTokens ? `, +${q.rewardTokens} tokens` : ''}`);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Daily Quests</Text>
			{quests.map(q => (
				<View key={q.id} style={styles.card}>
					<Text style={styles.qTitle}>{q.title}</Text>
					<View style={styles.progressBar}>
						<View style={[styles.progressFill, { width: `${Math.floor((q.progress/q.goal)*100)}%` }]} />
					</View>
					<Pressable style={styles.btn} onPress={() => claim(q)} disabled={q.progress < q.goal}>
						<Text style={styles.btnText}>{q.progress < q.goal ? 'In Progress' : 'Claim'}</Text>
					</Pressable>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 12 },
	card: { backgroundColor: '#0b1220', borderColor: '#1f2937', borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 12 },
	qTitle: { color: 'white', fontWeight: '700', marginBottom: 8 },
	progressBar: { height: 10, backgroundColor: '#111827', borderRadius: 6, overflow: 'hidden' },
	progressFill: { height: '100%', backgroundColor: '#22c55e' },
	btn: { marginTop: 8, backgroundColor: '#334155', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
	btnText: { color: 'white', fontWeight: '700' }
});

