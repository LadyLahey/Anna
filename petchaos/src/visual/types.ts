export type VisualParams = {
	bodyColor: string;
	patternColor: string;
	accentColor: string;
	glowColor: string;
	bodyShape: 'cat' | 'bird' | 'blob';
	ears?: 'rounded' | 'none';
	beak?: 'small' | 'none';
	eyeStyle: 'normal' | 'tiny' | 'blink';
	patternType?: 'none' | 'drip' | 'gradient' | 'stars' | 'spikes';
	accessories: string[];
	aura: boolean;
};

