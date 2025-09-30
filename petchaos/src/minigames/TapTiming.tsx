import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function TapTiming({ onDone }: { onDone: (stars: number) => void }) {
	const [pos, setPos] = useState(0);
	const [dir, setDir] = useState(1);
	const timer = useRef<any>(null);
	useEffect(() => {
		timer.current = setInterval(() => {
			setPos(p => {
				let np = p + dir * 5;
				if (np >= 100 || np <= 0) setDir(d => -d);
				return Math.max(0, Math.min(100, np));
			});
		}, 50);
		return () => clearInterval(timer.current);
	}, [dir]);

	const tap = () => {
		const inGreen = pos >= 40 && pos <= 60;
		const stars = inGreen ? 3 : pos >= 30 && pos <= 70 ? 2 : 1;
		onDone(stars);
	};

	return (
		<View style={styles.container}>
			<View style={styles.bar}>
				<View style={[styles.green, { left: '40%' }]} />
				<View style={[styles.green, { left: '60%' }]} />
				<View style={[styles.marker, { left: `${pos}%` }]} />
			</View>
			<Pressable style={styles.btn} onPress={tap}><Text style={styles.btnText}>Tap!</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	bar: { height: 16, backgroundColor: '#111827', borderRadius: 10, position: 'relative', overflow: 'hidden' },
	green: { position: 'absolute', top: 0, bottom: 0, width: '20%', backgroundColor: '#22c55e', opacity: 0.5 },
	marker: { position: 'absolute', top: 0, bottom: 0, width: 4, backgroundColor: '#f59e0b' },
	btn: { marginTop: 12, backgroundColor: '#7c3aed', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	btnText: { color: 'white', fontWeight: '800' }
});

