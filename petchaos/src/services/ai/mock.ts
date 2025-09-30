import * as FileSystem from 'expo-file-system';

type Summary = { topics: string[]; mood: string; keywords: string[] };

function hashStringToInt(input: string): number {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
	}
	return Math.abs(h >>> 0);
}

const moods = ['wholesome','chaotic','spooky','drippy','sleepy','zoomy'];
const topicsPool = ['cat','dog','lizard','bird','blob','meme','sparkle','glitter'];
const keywordsPool = ['sparkle','glitter','neon','vintage','glitch','cosmic','slime'];

async function fileHash(uri: string): Promise<number> {
	try {
		const info = await FileSystem.getInfoAsync(uri);
		const key = `${uri}:${info.size || 0}:${info.modificationTime || 0}`;
		return hashStringToInt(key);
	} catch {
		return hashStringToInt(uri);
	}
}

export async function analyzeMediaMock(uri: string): Promise<Summary> {
	const h = await fileHash(uri);
	const mood = moods[h % moods.length];
	const t1 = topicsPool[h % topicsPool.length];
	const t2 = topicsPool[(h >> 3) % topicsPool.length];
	const k1 = keywordsPool[(h >> 5) % keywordsPool.length];
	const k2 = keywordsPool[(h >> 7) % keywordsPool.length];
	return { topics: Array.from(new Set([t1, t2])), mood, keywords: Array.from(new Set([k1, k2])) };
}

