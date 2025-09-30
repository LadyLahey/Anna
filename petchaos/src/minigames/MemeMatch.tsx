import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

type Card = { id: string; img?: string; flipped: boolean; matched: boolean };

export default function MemeMatch({ lastImage, onDone }: { lastImage?: string; onDone: (win: boolean) => void }) {
	const [cards, setCards] = useState<Card[]>(() => {
		const imgs = [lastImage, undefined].filter(Boolean) as string[];
		const base: Card[] = [
			{ id: 'a1', img: imgs[0], flipped: false, matched: false },
			{ id: 'a2', img: imgs[0], flipped: false, matched: false },
			{ id: 'b1', img: undefined, flipped: false, matched: false },
			{ id: 'b2', img: undefined, flipped: false, matched: false }
		];
		return base.sort(() => Math.random() - 0.5);
	});
	const [sel, setSel] = useState<number[]>([]);

	const tap = (i: number) => {
		if (cards[i].flipped || cards[i].matched) return;
		const next = cards.slice();
		next[i] = { ...next[i], flipped: true };
		setCards(next);
		const s = [...sel, i];
		setSel(s);
		if (s.length === 2) {
			setTimeout(() => {
				const [i1, i2] = s;
				const c1 = next[i1];
				const c2 = next[i2];
				if ((c1.img || 'x') === (c2.img || 'x')) {
					next[i1] = { ...c1, matched: true };
					next[i2] = { ...c2, matched: true };
					setCards(next);
					if (next.every(c => c.matched)) onDone(true);
				} else {
					next[i1] = { ...c1, flipped: false };
					next[i2] = { ...c2, flipped: false };
					setCards(next);
				}
				setSel([]);
			}, 600);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.grid}>
				{cards.map((c, i) => (
					<Pressable key={c.id} style={styles.card} onPress={() => tap(i)}>
						{c.flipped || c.matched ? (c.img ? <Image source={{ uri: c.img }} style={styles.img} /> : <Text style={styles.cardTxt}>🙂</Text>) : <Text style={styles.cardTxt}>❓</Text>}
					</Pressable>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	grid: { flexDirection: 'row', flexWrap: 'wrap' },
	card: { width: '45%', aspectRatio: 1, margin: '2.5%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', borderRadius: 12 },
	img: { width: '80%', height: '80%', borderRadius: 8 },
	cardTxt: { color: 'white', fontSize: 24 }
});

