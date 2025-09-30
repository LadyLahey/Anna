import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

export type MediaSelection = {
	imageUri?: string;
	audioUri?: string;
	audioDurationSec?: number;
};

type Props = {
	value: MediaSelection;
	onChange: (v: MediaSelection) => void;
};

export default function FeedMedia({ value, onChange }: Props) {
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const recRef = useRef<Audio.Recording | null>(null);

	useEffect(() => {
		Audio.requestPermissionsAsync();
	}, []);

	const pickFromGallery = async () => {
		const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!perm.granted) return;
		const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.7 });
		if (!res.canceled && res.assets && res.assets[0]?.uri) {
			const tmp = await saveTemp(res.assets[0].uri);
			onChange({ ...value, imageUri: tmp });
		}
	};

	const takePhoto = async () => {
		const perm = await ImagePicker.requestCameraPermissionsAsync();
		if (!perm.granted) return;
		const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
		if (!res.canceled && res.assets && res.assets[0]?.uri) {
			const tmp = await saveTemp(res.assets[0].uri);
			onChange({ ...value, imageUri: tmp });
		}
	};

	const toggleRecord = async () => {
		if (isRecording) {
			try {
				await recRef.current?.stopAndUnloadAsync();
				const uri = recRef.current?.getURI();
				const dur = (await recRef.current?.getStatusAsync()) as any;
				const duration = Math.round((dur?.durationMillis || 0) / 1000);
				if (uri) {
					const tmp = await saveTemp(uri);
					onChange({ ...value, audioUri: tmp, audioDurationSec: duration });
				}
			} finally {
				setIsRecording(false);
				setRecording(null);
				recRef.current = null;
			}
			return;
		}
		const permission = await Audio.requestPermissionsAsync();
		if (!permission.granted) return;
		await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
		const rec = new Audio.Recording();
		await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
		await rec.startAsync();
		setRecording(rec);
		recRef.current = rec;
		setIsRecording(true);
	};

	const clear = () => onChange({});

	const mmss = (sec?: number) => {
		if (!sec) return '00:00';
		const m = Math.floor(sec / 60).toString().padStart(2, '0');
		const s = Math.floor(sec % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Pressable style={[styles.btn, styles.primary]} onPress={pickFromGallery}><Text style={styles.btnText}>Pick Meme</Text></Pressable>
				<Pressable style={[styles.btn, styles.secondary]} onPress={takePhoto}><Text style={styles.btnText}>Take Photo</Text></Pressable>
			</View>
			<View style={styles.row}>
				<Pressable style={[styles.recordBtn, isRecording ? styles.recording : styles.recordIdle]} onPress={toggleRecord}>
					<Text style={styles.recordText}>{isRecording ? 'Stop' : 'Record Audio'}</Text>
				</Pressable>
				<Pressable style={[styles.btn, styles.clear]} onPress={clear}><Text style={styles.btnText}>Clear</Text></Pressable>
			</View>
			{value.imageUri ? (
				<View style={styles.previewRow}>
					<Image source={{ uri: value.imageUri }} style={styles.thumb} />
					<Text style={styles.meta}>Selected meme</Text>
				</View>
			) : null}
			{value.audioUri ? (
				<View style={styles.previewRow}>
					<Text style={styles.meta}>Audio: {mmss(value.audioDurationSec)}</Text>
				</View>
			) : null}
		</View>
	);
}

async function saveTemp(srcUri: string): Promise<string> {
	const filename = srcUri.split('/').pop() || `media-${Date.now()}`;
	const dest = `${FileSystem.cacheDirectory}${filename}`;
	await FileSystem.copyAsync({ from: srcUri, to: dest });
	return dest;
}

const styles = StyleSheet.create({
	container: { marginTop: 12 },
	row: { flexDirection: 'row', marginBottom: 8 },
	btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
	primary: { backgroundColor: '#7c3aed' },
	secondary: { backgroundColor: '#334155' },
	clear: { backgroundColor: '#6b7280' },
	btnText: { color: 'white', fontWeight: '700' },
	recordBtn: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', marginRight: 8 },
	recordIdle: { backgroundColor: '#ef4444' },
	recording: { backgroundColor: '#10b981' },
	recordText: { color: 'white', fontWeight: '800' },
	previewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
	thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 8 },
	meta: { color: '#cbd5e1' }
});

