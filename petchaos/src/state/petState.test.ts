import { addXp, evolveIfReady, levelFromXp } from './petState';
import { Pet } from '../types/pet';

function makePet(): Pet {
	return { id: '1', species: 'Cat', stage: 1, xp: 0, level: 1, stats: { hunger: 50, happiness: 50, energy: 50 }, traits: [] };
}

describe('petState helpers', () => {
	it('levelFromXp follows sqrt curve', () => {
		expect(levelFromXp(0)).toBe(1);
		expect(levelFromXp(25)).toBe(2);
		expect(levelFromXp(100)).toBe(3);
	});

	it('addXp increases xp and level', () => {
		const p = makePet();
		const p2 = addXp(p, 30);
		expect(p2.xp).toBe(30);
		expect(p2.level).toBeGreaterThanOrEqual(2);
	});

	it('evolveIfReady bumps stage on thresholds', () => {
		const p = makePet();
		const evolved = evolveIfReady({ ...p, xp: 300, level: levelFromXp(300) });
		expect(evolved.stage).toBeGreaterThanOrEqual(2);
	});
});

