import AsyncStorage from '@react-native-async-storage/async-storage';

export type HistoryEntry = {
	createdAt: number;
	imageUri?: string;
	audioUri?: string;
	result: { topics: string[]; mood: string; keywords: string[] };
};

const KEY = '@petchaos/history';

export async function pushHistory(entry: HistoryEntry): Promise<void> {
	const raw = await AsyncStorage.getItem(KEY);
	const list: HistoryEntry[] = raw ? JSON.parse(raw) : [];
	const next = [entry, ...list].slice(0, 5);
	await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function getHistory(): Promise<HistoryEntry[]> {
	const raw = await AsyncStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : [];
}

