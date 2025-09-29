import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getPetFromStorage, getTokensFromStorage, savePetToStorage, saveTokensToStorage } from '../services/storage';
import { Pet } from '../engine/petEngine';

type AppState = {
	pet: Pet | null;
	tokens: number;
	setPet: (p: Pet | null) => void;
	addTokens: (n: number) => void;
	spendToken: (n?: number) => boolean;
};

const Ctx = createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [pet, setPetState] = useState<Pet | null>(null);
	const [tokens, setTokensState] = useState<number>(0);

	useEffect(() => {
		(async () => {
			const [storedPet, storedTokens] = await Promise.all([getPetFromStorage(), getTokensFromStorage()]);
			if (storedPet) setPetState(storedPet);
			setTokensState(storedTokens ?? 0);
		})();
	}, []);

	const setPet = (p: Pet | null) => {
		setPetState(p);
		savePetToStorage(p);
	};

	const addTokens = (n: number) => {
		setTokensState(t => {
			const next = t + n;
			saveTokensToStorage(next);
			return next;
		});
	};

	const spendToken = (n: number = 1) => {
		let ok = false;
		setTokensState(t => {
			if (t >= n) {
				ok = true;
				const next = t - n;
				saveTokensToStorage(next);
				return next;
			}
			return t;
		});
		return ok;
	};

	const value = useMemo(() => ({ pet, tokens, setPet, addTokens, spendToken }), [pet, tokens]);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAppState = () => {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
	return ctx;
};

