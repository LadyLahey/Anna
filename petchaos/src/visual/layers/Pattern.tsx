import React from 'react';
import { G, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { VisualParams } from '../types';

export default function Pattern({ params, size }: { params: VisualParams; size: number }) {
	const s = size;
	if (params.patternType === 'drip') {
		return (
			<G opacity={0.5}>
				<Path d={`M ${s*0.3} ${s*0.2} C ${s*0.35} ${s*0.3}, ${s*0.4} ${s*0.4}, ${s*0.35} ${s*0.5}`} stroke={params.patternColor} strokeWidth={4} />
				<Path d={`M ${s*0.6} ${s*0.2} C ${s*0.65} ${s*0.3}, ${s*0.7} ${s*0.4}, ${s*0.65} ${s*0.5}`} stroke={params.patternColor} strokeWidth={4} />
			</G>
		);
	}
	if (params.patternType === 'gradient') {
		return (
			<G opacity={0.4}>
				<Defs>
					<LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
						<Stop offset="0" stopColor={params.patternColor} />
						<Stop offset="1" stopColor={params.accentColor} />
					</LinearGradient>
				</Defs>
				<Circle cx={s*0.5} cy={s*0.5} r={s*0.28} fill="url(#grad)" />
			</G>
		);
	}
	if (params.patternType === 'spikes') {
		return <Path d={`M ${s*0.2} ${s*0.6} l ${s*0.1} ${-s*0.1} l ${s*0.1} ${s*0.1} Z`} fill={params.patternColor} opacity={0.6} />;
	}
	if (params.patternType === 'stars') {
		return (
			<G opacity={0.6}>
				<Circle cx={s*0.3} cy={s*0.35} r={2} fill={params.accentColor} />
				<Circle cx={s*0.7} cy={s*0.45} r={2} fill={params.accentColor} />
				<Circle cx={s*0.5} cy={s*0.25} r={2} fill={params.accentColor} />
			</G>
		);
	}
	return null;
}

