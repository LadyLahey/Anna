import AsyncStorage from '@react-native-async-storage/async-storage';
import { addXp, getInventory, saveInventory, savePet, xpForAction } from '../state/petState';
import { Pet } from '../types/pet';

export type QuestType = 'FEED_IMAGE' | 'FEED_AUDIO' | 'PLAY_MINIGAME' | 'STREAK';
export type Quest = { id: string; title: string; progress: number; goal: number; rewardXp: number; rewardTokens?: number; type: QuestType };

function todayKey() { const d = new Date(); return `@petchaos/quests:${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }

export async function getTodayQuests(seed: number = 42): Promise<Quest[]> {
	const key = todayKey();
	const raw = await AsyncStorage.getItem(key);
	if (raw) return JSON.parse(raw);
	const base: Quest[] = [
		{ id: 'q1', title: 'Feed an image', progress: 0, goal: 1, rewardXp: 10, rewardTokens: 1, type: 'FEED_IMAGE' },
		{ id: 'q2', title: 'Play a minigame', progress: 0, goal: 1, rewardXp: 12, type: 'PLAY_MINIGAME' },
		{ id: 'q3', title: 'Daily streak', progress: 0, goal: 1, rewardXp: 8, type: 'STREAK' }
	];
	await AsyncStorage.setItem(key, JSON.stringify(base));
	return base;
}

export async function applyQuestProgress(type: QuestType): Promise<{ completed: Quest[]; quests: Quest[] }> {
	const key = todayKey();
	const raw = await AsyncStorage.getItem(key);
	const quests: Quest[] = raw ? JSON.parse(raw) : await getTodayQuests();
	const next = quests.map(q => q.type === type ? { ...q, progress: Math.min(q.goal, q.progress + 1) } : q);
	await AsyncStorage.setItem(key, JSON.stringify(next));
	const completed = next.filter(q => q.progress >= q.goal);
	return { completed, quests: next };
}

export async function claimQuestRewards(pet: Pet, quest: Quest): Promise<Pet> {
	let updated = addXp(pet, quest.rewardXp);
	if (quest.rewardTokens) {
		const inv = await getInventory();
		inv.tokens += quest.rewardTokens;
		await saveInventory(inv);
	}
	await savePet(updated);
	return updated;
}

