import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { addXp, changeStat, getInventory, getPet, saveInventory, savePet, xpForAction } from '../state/petState';
import { Pet } from '../types/pet';
import FeedMedia, { MediaSelection } from '../components/FeedMedia';
import { analyzeImage } from '../services/ai/vision';
import { analyzeAudio } from '../services/ai/audio';
import { mixTraits } from '../services/petMixer';

function XpBar({ xp, level }: { xp: number; level: number }) {
	const nextLv = (level + 0) * (level + 0) * 25; // rough visual only
	const prevLv = (level - 1) * (level - 1) * 25;
	const span = Math.max(1, nextLv - prevLv);
	const prog = Math.max(0, Math.min(1, (xp - prevLv) / span));
	return (
		<View style={styles.xpContainer}>
			<View style={[styles.xpFill, { width: `${Math.floor(prog * 100)}%` }]} />
			<Text style={styles.xpText}>LV {level} · XP {xp}</Text>
		</View>
	);
}

export default function PetProfileScreen({ navigation }: any) {
	const [pet, setPetState] = useState<Pet | null>(null);
	const [inv, setInv] = useState<{ tokens: number }>({ tokens: 0 });
	const [media, setMedia] = useState<MediaSelection>({});
	const [busy, setBusy] = useState(false);
	const isFocused = useIsFocused();

	useEffect(() => {
		(async () => {
			const p = await getPet();
			const i = await getInventory();
			if (p) setPetState(p);
			setInv(i);
		})();
	}, [isFocused]);

	const saveBoth = async (p: Pet) => {
		setPetState(p);
		await savePet(p);
	};

	const feedText = async () => {
		if (!pet) return;
		const xp = xpForAction('FEED');
		const updated = changeStat(changeStat(addXp(pet, xp), 'hunger', 10), 'happiness', 5);
		await saveBoth({ ...updated, lastFedAt: Date.now() });
		Alert.alert('Fed!', `+${xp} XP`);
	};

	const ensureTokenForVision = async (): Promise<boolean> => {
		const i = await getInventory();
		if (i.tokens <= 0) {
			Alert.alert('Need a token', 'Chaos Vision requires 1 token.', [
				{ text: 'Open Store', onPress: () => navigation.navigate('Store') },
				{ text: 'Cancel' }
			]);
			return false;
		}
		i.tokens -= 1;
		await saveInventory(i);
		setInv(i);
		return true;
	};

	const feedMedia = async () => {
		if (!pet) return;
		if (!media.imageUri && !media.audioUri) return feedText();
		setBusy(true);
		try {
			if (!(await ensureTokenForVision())) return;
			const summary = media.imageUri ? await analyzeImage(media.imageUri) : await analyzeAudio(media.audioUri as string);
			const mix = mixTraits(summary);
			const bonus = 3;
			let updated: Pet = { ...pet };
			updated = addXp(updated, xpForAction('FEED') + bonus);
			updated = changeStat(changeStat(updated, 'hunger', 12), 'happiness', 8);
			updated = { ...updated, traits: Array.from(new Set([...updated.traits, ...mix.traits])), mediaThumb: media.imageUri || updated.mediaThumb, lastFedAt: Date.now() };
			await saveBoth(updated);
			Alert.alert('Fed with Vision!', `+${xpForAction('FEED') + bonus} XP`);
		} catch (e) {
			Alert.alert('Analysis failed', 'Try again or use text feed.');
		} finally {
			setBusy(false);
		}
	};

	if (!pet) {
		return (
			<View style={styles.container}><Text style={styles.meta}>No pet yet.</Text></View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Your Pet</Text>
				{pet.mediaThumb ? <Image source={{ uri: pet.mediaThumb }} style={styles.thumb} /> : null}
			</View>
			<XpBar xp={pet.xp} level={pet.level} />
			<Text style={styles.meta}>Stage {pet.stage} · Tokens {inv.tokens}</Text>
			<View style={styles.statsRow}>
				<Text style={styles.stat}>🍗 {pet.stats.hunger}%</Text>
				<Text style={styles.stat}>😊 {pet.stats.happiness}%</Text>
				<Text style={styles.stat}>⚡ {pet.stats.energy}%</Text>
			</View>
			<View style={styles.traitsRow}>
				{pet.traits.map(t => (<View key={t} style={styles.traitChip}><Text style={styles.traitText}>{t}</Text></View>))}
			</View>
			<FeedMedia value={media} onChange={setMedia} />
			<View style={styles.actions}>
				<Pressable style={styles.btn} onPress={feedText} disabled={busy}><Text style={styles.btnText}>Feed Text</Text></Pressable>
				<Pressable style={styles.btn} onPress={feedMedia} disabled={busy}><Text style={styles.btnText}>Feed Meme/Audio</Text></Pressable>
			</View>
			<View style={styles.actions}>
				<Pressable style={styles.btn} onPress={() => navigation.navigate('Minigames')}><Text style={styles.btnText}>Play Minigame</Text></Pressable>
				<Pressable style={styles.btn} onPress={() => navigation.navigate('Quests')}><Text style={styles.btnText}>Quests</Text></Pressable>
				<Pressable style={styles.btn} onPress={() => navigation.navigate('Store')}><Text style={styles.btnText}>Store</Text></Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#0e0f12' },
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	title: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 8 },
	thumb: { width: 48, height: 48, borderRadius: 8 },
	xpContainer: { height: 16, backgroundColor: '#111827', borderRadius: 10, overflow: 'hidden', marginTop: 8 },
	xpFill: { height: '100%', backgroundColor: '#7c3aed' },
	xpText: { position: 'absolute', color: 'white', fontSize: 12, fontWeight: '700', left: 8, top: -2 },
	meta: { color: '#cbd5e1', marginTop: 8 },
	statsRow: { flexDirection: 'row', marginTop: 8 },
	stat: { color: 'white', marginRight: 12 },
	traitsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
	traitChip: { backgroundColor: '#1f2937', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
	traitText: { color: 'white', fontWeight: '700' },
	actions: { flexDirection: 'row', marginTop: 12 },
	btn: { backgroundColor: '#334155', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
	btnText: { color: 'white', fontWeight: '700' }
});

