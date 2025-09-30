import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppState } from '../state/AppState';
import { mutatePet } from '../engine/petEngine';

type Props = NativeStackScreenProps<RootStackParamList, 'Store'>;

export default function StoreScreen({ navigation }: Props) {
	const { pet, setPet, tokens, addTokens, spendToken } = useAppState();
	const [message, setMessage] = useState<string | null>(null);

	const mockPurchase = () => {
		addTokens(5);
		setMessage('Purchased 5 Chaos Tokens (mock)!');
	};

	const mockPurchase20 = () => {
		addTokens(20);
		setMessage('Purchased 20 Chaos Tokens (mock)!');
	};

	const rerollMutation = () => {
		if (!pet) return setMessage('You need a pet first.');
		if (!spendToken(1)) return setMessage('Not enough tokens.');
		const next = mutatePet(pet, 1);
		setPet(next);
		setMessage('Mutation applied!');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>🛒 Chaos Store (Mock)</Text>
			<Text style={styles.meta}>Tokens: {tokens}</Text>
			<View style={styles.row}>
				<Pressable style={[styles.buy, { marginRight: 12 }]} onPress={mockPurchase}><Text style={styles.buyText}>Buy 5 Tokens</Text></Pressable>
				<Pressable style={[styles.buy, { marginRight: 12, backgroundColor: '#16a34a' }]} onPress={mockPurchase20}><Text style={styles.buyText}>Buy 20 Tokens</Text></Pressable>
				<Pressable style={styles.reroll} onPress={rerollMutation}><Text style={styles.rerollText}>Reroll Mutation (-1)</Text></Pressable>
			</View>
			{message ? <Text style={styles.msg}>{message}</Text> : null}
			<Pressable style={styles.back} onPress={() => navigation.navigate('Reveal')}>
				<Text style={styles.backText}>Back to Pet</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: '#0e0f12' },
	title: { color: 'white', fontSize: 24, fontWeight: '700', marginTop: 24 },
	meta: { color: '#cbd5e1', marginTop: 8, marginBottom: 16 },
	row: { flexDirection: 'row' },
	buy: { backgroundColor: '#22c55e', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
	buyText: { color: '#052e16', fontWeight: '800' },
	reroll: { backgroundColor: '#f59e0b', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
	rerollText: { color: '#1f1300', fontWeight: '800' },
	msg: { color: '#a5b4fc', marginTop: 16 },
	back: { marginTop: 24, backgroundColor: '#334155', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	backText: { color: 'white', fontWeight: '700' }
});

