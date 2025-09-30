import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Svg, { G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import Body from './layers/Body';
import Pattern from './layers/Pattern';
import Face from './layers/Face';
import Accessory from './layers/Accessory';
import Aura from './layers/Aura';
import { paramsFromPet } from './mappers';

const AnimatedSvg = Animated.createAnimatedComponent(Svg as any);

type Props = { pet: { id: string; species: string; traits: string[]; stage: number }; size?: number; onShotUri?: (uri: string) => void; animIdle?: boolean };

export default function PetCanvas({ pet, size = 280, onShotUri, animIdle = false }: Props) {
	const shotRef = useRef<ViewShot>(null);
	const [blink, setBlink] = useState(false);
	const params = useMemo(() => paramsFromPet(pet), [pet.id, pet.species, pet.stage, pet.traits.join(':')]);

	useEffect(() => {
		if (!animIdle) return;
		const t = setInterval(() => { setBlink(b => !b); }, 3000 + Math.random() * 2000);
		return () => clearInterval(t);
	}, [animIdle]);

	const ty = useSharedValue(0);
	useEffect(() => {
		if (!animIdle) return;
		ty.value = withRepeat(withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.quad) }), -1, true);
	}, [animIdle]);
	const aStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

	const takeShot = async () => {
		if (!shotRef.current) return;
		const uri = await shotRef.current.capture?.({ format: 'png', quality: 1 });
		if (uri && onShotUri) onShotUri(uri as string);
	};

	return (
		<ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
			<AnimatedSvg width={size} height={size} style={aStyle}>
				<G>
					<Aura params={params} size={size} />
					<Body params={params} size={size} />
					<Pattern params={params} size={size} />
					<Face params={params} size={size} blink={blink} />
					<Accessory params={params} size={size} />
				</G>
			</AnimatedSvg>
		</ViewShot>
	);
}

