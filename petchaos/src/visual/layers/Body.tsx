import React from 'react';
import { G, Path, Circle } from 'react-native-svg';
import { VisualParams } from '../types';

export default function Body({ params, size }: { params: VisualParams; size: number }) {
	const s = size;
	if (params.bodyShape === 'cat') {
		return (
			<G>
				<Path d={`M ${s*0.2} ${s*0.5} C ${s*0.2} ${s*0.2}, ${s*0.8} ${s*0.2}, ${s*0.8} ${s*0.5} C ${s*0.8} ${s*0.8}, ${s*0.2} ${s*0.8}, ${s*0.2} ${s*0.5} Z`} fill={params.bodyColor} />
				{params.ears === 'rounded' && (
					<>
						<Circle cx={s*0.33} cy={s*0.22} r={s*0.08} fill={params.bodyColor} />
						<Circle cx={s*0.67} cy={s*0.22} r={s*0.08} fill={params.bodyColor} />
					</>
				)}
			</G>
		);
	}
	if (params.bodyShape === 'bird') {
		return <Path d={`M ${s*0.5} ${s*0.2} C ${s*0.8} ${s*0.3}, ${s*0.7} ${s*0.8}, ${s*0.5} ${s*0.9} C ${s*0.3} ${s*0.8}, ${s*0.2} ${s*0.3}, ${s*0.5} ${s*0.2} Z`} fill={params.bodyColor} />;
	}
	return <Circle cx={s*0.5} cy={s*0.5} r={s*0.3} fill={params.bodyColor} />;
}

