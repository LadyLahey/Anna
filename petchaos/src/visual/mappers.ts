import { VisualParams } from './types';
import { pickPalette, seededRandom } from './palette';

export function paramsFromPet(input: { id: string; species: string; traits: string[]; stage: number }): VisualParams {
	const seedBase = Math.abs(hash(`${input.id}:${input.traits.join(':')}`));
	const rand = seededRandom(seedBase);
	const palette = pickPalette(Math.floor(rand() * 1000));

	let bodyShape: VisualParams['bodyShape'] = 'blob';
	let ears: VisualParams['ears'] = 'none';
	let beak: VisualParams['beak'] = 'none';
	if (input.species === 'Cat') { bodyShape = 'cat'; ears = 'rounded'; }
	else if (input.species === 'Bird') { bodyShape = 'bird'; beak = 'small'; }

	let eyeStyle: VisualParams['eyeStyle'] = 'normal';
	let patternType: VisualParams['patternType'] = 'none';
	let accessories: string[] = [];
	let aura = false;

	const traitsLower = input.traits.map(t => t.toLowerCase());
	if (traitsLower.includes('cursed')) { aura = true; eyeStyle = 'tiny'; }
	if (traitsLower.includes('drippy')) patternType = 'drip';
	if (traitsLower.includes('vibey')) patternType = 'gradient';
	if (traitsLower.includes('spiky')) patternType = 'spikes';
	if (traitsLower.includes('sparkly')) patternType = 'stars';
	if (traitsLower.includes('royal') && input.stage >= 3) accessories.push('crown');

	if (input.stage >= 3) aura = true;

	return {
		bodyColor: palette.primary,
		patternColor: palette.secondary,
		accentColor: palette.accent,
		glowColor: palette.glow,
		bodyShape,
		ears,
		beak,
		eyeStyle,
		patternType,
		accessories,
		aura
	};
}

function hash(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
	}
	return h >>> 0;
}

