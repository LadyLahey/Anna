import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../engine/petEngine';

const PET_KEY = 'petchaos:pet';
const TOKENS_KEY = 'petchaos:tokens';

export async function savePetToStorage(pet: Pet | null) {
	if (!pet) {
		await AsyncStorage.removeItem(PET_KEY);
		return;
	}
	await AsyncStorage.setItem(PET_KEY, JSON.stringify(pet));
}

export async function getPetFromStorage(): Promise<Pet | null> {
	const raw = await AsyncStorage.getItem(PET_KEY);
	return raw ? (JSON.parse(raw) as Pet) : null;
}

export async function saveTokensToStorage(tokens: number) {
	await AsyncStorage.setItem(TOKENS_KEY, String(tokens));
}

export async function getTokensFromStorage(): Promise<number> {
	const raw = await AsyncStorage.getItem(TOKENS_KEY);
	return raw ? Number(raw) : 0;
}

