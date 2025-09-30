import { mixTraits } from './petMixer';

describe('mixTraits', () => {
	it('picks Cat when topics include cat', () => {
		const res = mixTraits({ topics: ['Cat'], mood: '', keywords: [] });
		expect(res.species).toBe('Cat');
	});

	it('adds chaotic trait when mood includes chaotic', () => {
		const res = mixTraits({ topics: [], mood: 'very chaotic energy', keywords: [] });
		expect(res.traits).toContain('chaotic');
	});

	it('adds drippy when keywords contain sparkle', () => {
		const res = mixTraits({ topics: [], mood: '', keywords: ['sparkle'] });
		expect(res.traits).toContain('drippy');
	});
});

