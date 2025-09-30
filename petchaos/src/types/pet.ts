export type StatKey = 'hunger' | 'happiness' | 'energy';

export type Pet = {
	id: string;
	species: 'Cat' | 'Dog' | 'Lizard' | 'Blob' | 'Bird';
	stage: number;
	xp: number;
	level: number;
	stats: Record<StatKey, number>;
	traits: string[];
	lastFedAt?: number;
	mediaThumb?: string;
};

export type Inventory = {
	tokens: number;
};

export type FeedResult = {
	xpGained: number;
	traitsDelta?: string[];
	mediaThumb?: string;
};

