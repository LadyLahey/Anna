import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getInventory, getPet, saveInventory, savePet } from '../state/petState';
import { mutatePet } from '../engine/petEngine';

type Props = NativeStackScreenProps<RootStackParamList, 'Store'>;

export default function StoreScreen({ navigation }: Props) {
    const [tokens, setTokens] = useState<number>(0);
    const [message, setMessage] = useState<string | null>(null);

    React.useEffect(() => { (async () => { const inv = await getInventory(); setTokens(inv.tokens); })(); }, []);

    const mockPurchase = async () => {
        const inv = await getInventory();
        inv.tokens += 5;
        await saveInventory(inv);
        setTokens(inv.tokens);
        setMessage('Purchased 5 Chaos Tokens (mock)!');
    };

    const mockPurchase20 = async () => {
        const inv = await getInventory();
        inv.tokens += 20;
        await saveInventory(inv);
        setTokens(inv.tokens);
        setMessage('Purchased 20 Chaos Tokens (mock)!');
    };

    const rerollMutation = async () => {
        const pet = await getPet();
        if (!pet) return setMessage('You need a pet first.');
        const inv = await getInventory();
        if (inv.tokens <= 0) return setMessage('Not enough tokens.');
        inv.tokens -= 1;
        await saveInventory(inv);
        setTokens(inv.tokens);
        const next = mutatePet({ ...pet, traits: pet.traits }, 1) as any;
        await savePet({ ...pet, stage: next.stage, traits: next.traits });
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

