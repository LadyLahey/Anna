const bannedWords = ['nsfw','slur_one','slur_two'];
const urlRegex = /(https?:\/\/|www\.)/i;

export function isTextSafe(input: string): boolean {
	const lower = input.toLowerCase();
	if (urlRegex.test(lower)) return false;
	return !bannedWords.some(w => lower.includes(w));
}

export function sanitize(input: string): string {
	return input.trim().slice(0, 200);
}

