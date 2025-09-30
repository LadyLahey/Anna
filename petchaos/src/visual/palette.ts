export type Palette = { primary: string; secondary: string; accent: string; glow: string };

const palettes: Record<string, Palette> = {
	sunset: { primary: '#F59E0B', secondary: '#EF4444', accent: '#FDE68A', glow: '#F97316' },
	ocean: { primary: '#0EA5E9', secondary: '#0369A1', accent: '#22D3EE', glow: '#67E8F9' },
	candy: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#F472B6', glow: '#F0ABFC' },
	neon: { primary: '#22C55E', secondary: '#0EA5E9', accent: '#A3E635', glow: '#4ADE80' },
	forest: { primary: '#10B981', secondary: '#065F46', accent: '#84CC16', glow: '#34D399' }
};

export function pickPalette(seed: number): Palette {
	const keys = Object.keys(palettes);
	return palettes[keys[seed % keys.length]];
}

export function seededRandom(seed: number): () => number {
	let s = seed;
	return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

