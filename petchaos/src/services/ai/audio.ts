import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { analyzeMediaMock } from './mock';

type Summary = { topics: string[]; mood: string; keywords: string[] };

export async function analyzeAudio(uri: string): Promise<Summary> {
	const provider = (Constants.expoConfig?.extra?.AI_PROVIDER || 'mock') as string;
	const apiKey = (Constants.expoConfig?.extra?.OPENAI_API_KEY || '') as string;
	if (provider !== 'openai' || !apiKey) {
		return analyzeMediaMock(uri);
	}

	// 1) Whisper STT
	const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
	const audioB64 = `data:audio/m4a;base64,${file}`; // approximate; adjust per actual mime
	const sttRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ model: 'whisper-1', file: audioB64 })
	});
	if (!sttRes.ok) return analyzeMediaMock(uri);
	const sttData = await sttRes.json();
	const transcript = sttData?.text || '';

	// 2) Summarize transcript to shared shape
	const summaryRes = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'Extract topics, mood, and keywords from the transcript.' },
				{ role: 'user', content: `Transcript: ${transcript}\nReturn JSON {topics:[], mood:"", keywords:[]}` }
			],
			temperature: 0
		})
	});
	if (!summaryRes.ok) return analyzeMediaMock(uri);
	const data = await summaryRes.json();
	const text = data?.choices?.[0]?.message?.content || '';
	try {
		const json = JSON.parse(text);
		return { topics: json.topics || [], mood: json.mood || 'neutral', keywords: json.keywords || [] };
	} catch {
		return analyzeMediaMock(uri);
	}
}

