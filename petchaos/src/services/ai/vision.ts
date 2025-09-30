import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { analyzeMediaMock } from './mock';

type Summary = { topics: string[]; mood: string; keywords: string[] };

async function toBase64(uri: string): Promise<string> {
	const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
	return `data:image/*;base64,${b64}`;
}

export async function analyzeImage(uri: string): Promise<Summary> {
	const provider = (Constants.expoConfig?.extra?.AI_PROVIDER || 'mock') as string;
	const apiKey = (Constants.expoConfig?.extra?.OPENAI_API_KEY || '') as string;
	if (provider !== 'openai' || !apiKey) {
		return analyzeMediaMock(uri);
	}
	const imageData = await toBase64(uri);
	// Minimal OpenAI Vision-compatible request format (subject to update per SDK)
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'Extract topics, mood, and keywords from the image.' },
				{ role: 'user', content: [
					{ type: 'input_text', text: 'Analyze and return JSON {topics:[], mood:"", keywords:[]}' },
					{ type: 'input_image', image_url: imageData }
				]}
			],
			temperature: 0
		})
	});
	if (!res.ok) return analyzeMediaMock(uri);
	const data = await res.json();
	const text = data?.choices?.[0]?.message?.content || '';
	try {
		const json = JSON.parse(text);
		return { topics: json.topics || [], mood: json.mood || 'neutral', keywords: json.keywords || [] };
	} catch {
		return analyzeMediaMock(uri);
	}
}

