import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedResult, Inventory, Pet, StatKey } from '../types/pet';

export const KEY_CURRENT = '@petchaos/current';
export const KEY_INVENTORY = '@petchaos/inventory';
export const KEY_HISTORY = '@petchaos/history';

export async function getPet(): Promise<Pet | null> {
	const raw = await AsyncStorage.getItem(KEY_CURRENT);
	return raw ? (JSON.parse(raw) as Pet) : null;
}

export async function savePet(pet: Pet | null): Promise<void> {
	if (!pet) {
		await AsyncStorage.removeItem(KEY_CURRENT);
		return;
	}
	await AsyncStorage.setItem(KEY_CURRENT, JSON.stringify(pet));
}

export async function getInventory(): Promise<Inventory> {
	const raw = await AsyncStorage.getItem(KEY_INVENTORY);
	return raw ? (JSON.parse(raw) as Inventory) : { tokens: 0 };
}

export async function saveInventory(inv: Inventory): Promise<void> {
	await AsyncStorage.setItem(KEY_INVENTORY, JSON.stringify(inv));
}

export type HistoryEntry = {
	createdAt: number;
	petId: string;
	mediaThumb?: string;
	result: FeedResult | { topics: string[]; mood: string; keywords: string[] };
};

export async function pushHistory(entry: HistoryEntry): Promise<void> {
	const dateKey = KEY_HISTORY; // Using single list per spec earlier
	const raw = await AsyncStorage.getItem(dateKey);
	const list: HistoryEntry[] = raw ? JSON.parse(raw) : [];
	const next = [entry, ...list].slice(0, 5);
	await AsyncStorage.setItem(dateKey, JSON.stringify(next));
}

export function levelFromXp(xp: number): number {
	return Math.floor(Math.sqrt(xp / 25)) + 1;
}

export function xpForAction(action: 'FEED' | 'PLAY' | 'QUEST' | 'MINIGAME'): number {
	switch (action) {
		case 'FEED': return 8;
		case 'PLAY': return 5;
		case 'QUEST': return 10;
		case 'MINIGAME': return 12;
	}
}

export function evolveIfReady(pet: Pet): Pet {
	const newLevel = levelFromXp(pet.xp);
	let stage = pet.stage;
	if (newLevel >= 5 && stage < 2) stage = 2;
	if (newLevel >= 10 && stage < 3) stage = 3;
	return { ...pet, level: newLevel, stage };
}

export function changeStat(pet: Pet, key: StatKey, delta: number): Pet {
	const cur = pet.stats[key] || 0;
	const nextVal = Math.max(0, Math.min(100, cur + delta));
	return { ...pet, stats: { ...pet.stats, [key]: nextVal } };
}

export function addXp(pet: Pet, amount: number): Pet {
	const xp = pet.xp + amount;
	return evolveIfReady({ ...pet, xp, level: levelFromXp(xp) });
}

