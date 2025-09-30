import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import PetCanvas from './PetCanvas';

export type ShareCardHandle = { capture: () => Promise<string | undefined> };

const ShareCard = forwardRef<ShareCardHandle, { pet: any; onCapture: (uri: string) => void }>(function ShareCard({ pet, onCapture }, ref) {
    const vsRef = useRef<ViewShot>(null);
    useImperativeHandle(ref, () => ({
        async capture() {
            const uri = await vsRef.current?.capture?.({ format: 'png', quality: 1 });
            if (uri) onCapture(uri);
            return uri as string | undefined;
        }
    }));
    return (
        <ViewShot ref={vsRef} options={{ format: 'png', quality: 1 }}>
			<View style={styles.card}>
				<Text style={styles.logo}>PetChaos</Text>
				<View style={{ alignItems: 'center', marginVertical: 8 }}>
					<PetCanvas pet={pet} size={220} animIdle={false} />
				</View>
				<Text style={styles.meta}>{pet.species}</Text>
				<View style={styles.traitsRow}>
					{pet.traits.slice(0, 6).map((t: string) => (<View key={t} style={styles.traitChip}><Text style={styles.traitText}>{t}</Text></View>))}
				</View>
				<Text style={styles.water}>@petchaos</Text>
			</View>
        </ViewShot>
    );
});

export default ShareCard;

const styles = StyleSheet.create({
	card: { width: 320, backgroundColor: 'white', borderRadius: 16, padding: 12, alignItems: 'center' },
	logo: { color: '#111827', fontWeight: '900', fontSize: 18 },
	meta: { color: '#111827', marginTop: 4 },
	traitsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 },
	traitChip: { backgroundColor: '#e5e7eb', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8, margin: 4 },
	traitText: { color: '#111827', fontWeight: '700' },
	water: { marginTop: 8, color: '#6b7280', fontSize: 12 }
});

