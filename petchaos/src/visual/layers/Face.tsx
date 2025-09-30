import React from 'react';
import { G, Circle, Rect, Path } from 'react-native-svg';
import { VisualParams } from '../types';

export default function Face({ params, size, blink }: { params: VisualParams; size: number; blink: boolean }) {
	const s = size;
	const eyeR = params.eyeStyle === 'tiny' ? s*0.02 : s*0.03;
	const eyeY = s*0.48;
	return (
		<G>
			{params.beak === 'small' && <Path d={`M ${s*0.5} ${s*0.5} l ${s*0.04} ${s*0.02} l ${-s*0.04} ${s*0.02} Z`} fill={params.accentColor} />}
			{blink ? (
				<>
					<Rect x={s*0.42} y={eyeY} width={s*0.06} height={s*0.006} fill="#111827" />
					<Rect x={s*0.52} y={eyeY} width={s*0.06} height={s*0.006} fill="#111827" />
				</>
			) : (
				<>
					<Circle cx={s*0.45} cy={eyeY} r={eyeR} fill="#111827" />
					<Circle cx={s*0.55} cy={eyeY} r={eyeR} fill="#111827" />
				</>
			)}
		</G>
	);
}

