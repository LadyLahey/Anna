import React from 'react';
import { G, Path, Circle } from 'react-native-svg';
import { VisualParams } from '../types';

export default function Accessory({ params, size }: { params: VisualParams; size: number }) {
	const s = size;
	if (params.accessories.includes('crown')) {
		return (
			<G>
				<Path d={`M ${s*0.35} ${s*0.28} l ${s*0.06} ${-s*0.06} l ${s*0.06} ${s*0.06} l ${s*0.06} ${-s*0.06} l ${s*0.06} ${s*0.06} l 0 ${s*0.04} l ${-s*0.24} 0 Z`} fill={params.accentColor} />
				<Circle cx={s*0.41} cy={s*0.21} r={s*0.01} fill={params.glowColor} />
				<Circle cx={s*0.53} cy={s*0.21} r={s*0.01} fill={params.glowColor} />
				<Circle cx={s*0.65} cy={s*0.21} r={s*0.01} fill={params.glowColor} />
			</G>
		);
	}
	return null;
}

