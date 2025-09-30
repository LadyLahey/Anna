import { paramsFromPet } from './mappers';

describe('mappers', () => {
	it('deterministic params per seed', () => {
		const a = paramsFromPet({ id: 'id1', species: 'Cat', traits: ['drippy'], stage: 1 });
		const b = paramsFromPet({ id: 'id1', species: 'Cat', traits: ['drippy'], stage: 1 });
		expect(a).toEqual(b);
	});

	it('trait drippy sets pattern', () => {
		const p = paramsFromPet({ id: 'x', species: 'Blob', traits: ['drippy'], stage: 1 });
		expect(p.patternType).toBe('drip');
	});
});

