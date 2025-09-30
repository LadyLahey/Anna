import { PetSpecies } from '../engine/petEngine';

export type MediaSummary = { topics: string[]; mood: string; keywords: string[] };

export type MixResult = { species: PetSpecies; traits: string[]; stageDelta: number };

export function mixTraits(summary: MediaSummary): MixResult {
	const { topics = [], mood = '', keywords = [] } = summary;
	let species: PetSpecies = 'Blob';
	const traits: string[] = [];
	let stageDelta = 0;

	const lowerTopics = topics.map(t => t.toLowerCase());
	const lowerKeywords = keywords.map(k => k.toLowerCase());
	const lowerMood = mood.toLowerCase();

	if (lowerTopics.includes('cat')) species = 'Cat';
	else if (lowerTopics.includes('dog')) species = 'Dog';
	else if (lowerTopics.includes('lizard')) species = 'Lizard';
	else if (lowerTopics.includes('bird')) species = 'Bird';

	if (lowerMood.includes('chaotic')) traits.push('chaotic');
	if (lowerKeywords.some(k => /sparkle|glitter/.test(k))) traits.push('drippy');

	if (lowerMood.includes('epic') || lowerKeywords.includes('cosmic')) stageDelta += 1;

	return { species, traits: Array.from(new Set(traits)), stageDelta };
}

