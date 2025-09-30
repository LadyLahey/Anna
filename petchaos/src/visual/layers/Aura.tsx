import React from 'react';
import { Circle } from 'react-native-svg';
import { VisualParams } from '../types';

export default function Aura({ params, size }: { params: VisualParams; size: number }) {
	if (!params.aura) return null;
	const s = size;
	return <Circle cx={s*0.5} cy={s*0.5} r={s*0.36} fill={params.glowColor} opacity={0.2} />;
}

