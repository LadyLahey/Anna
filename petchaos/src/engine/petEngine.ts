export type PetSpecies = 'Cat' | 'Dog' | 'Lizard' | 'Blob' | 'Bird';
export type Pet = {
	id: string;
	name: string;
	species: PetSpecies;
	stage: number;
	traits: string[];
	mediaThumbUri?: string;
};

const speciesKeywords: Record<PetSpecies, string[]> = {
	Cat: ['cat', 'kitty', 'meow'],
	Dog: ['dog', 'pup', 'woof'],
	Lizard: ['lizard', 'dragon', 'gecko'],
	Blob: ['slime', 'blob', 'goo'],
	Bird: ['bird', 'birb', 'parrot']
};

function hashStringToInt(input: string): number {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
	}
	return Math.abs(h >>> 0);
}

function pickSpecies(text: string): PetSpecies {
	const lower = text.toLowerCase();
	for (const [sp, keys] of Object.entries(speciesKeywords) as [PetSpecies, string[]][]) {
		if (keys.some(k => lower.includes(k))) return sp;
	}
	const all: PetSpecies[] = ['Cat', 'Dog', 'Lizard', 'Blob', 'Bird'];
	return all[hashStringToInt(lower) % all.length];
}

function deriveTraits(text: string, seed: number): string[] {
	const pool = [
		'chaotic','sparkly','sleepy','zoomy','meme-infused','nocturnal',
		'wholesome','gremlin','vibey','drippy','cursed','blessed'
	];
	const traits: string[] = [];
	const count = 2 + (seed % 2);
	let s = seed;
	for (let i = 0; i < count; i++) {
		s = (s * 9301 + 49297) % 233280;
		traits.push(pool[s % pool.length]);
	}
	return Array.from(new Set(traits));
}

export function generatePetFromText(text: string): Pet {
	const species = pickSpecies(text);
	const seed = hashStringToInt(text + species);
	const traits = deriveTraits(text, seed);
	return {
		id: `${Date.now()}-${seed}`,
		name: species,
		species,
		stage: 1,
		traits
	};
}

export function mutatePet(pet: Pet, tokensSpent: number = 0): Pet {
	const nextStage = Math.min(3, pet.stage + 1);
	const extraTrait = tokensSpent > 0 ? 'premium-mutated' : 'mutated';
	const traits = Array.from(new Set([...pet.traits, extraTrait]));
	return { ...pet, stage: nextStage, traits };
}

