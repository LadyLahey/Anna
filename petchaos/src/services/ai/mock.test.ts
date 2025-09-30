import { analyzeMediaMock } from './mock';

describe('analyzeMediaMock', () => {
	it('returns deterministic shape', async () => {
		const a = await analyzeMediaMock('file:///tmp/a.png');
		const b = await analyzeMediaMock('file:///tmp/a.png');
		expect(a).toHaveProperty('topics');
		expect(a).toHaveProperty('mood');
		expect(a).toHaveProperty('keywords');
		expect(a).toEqual(b);
	});
});

