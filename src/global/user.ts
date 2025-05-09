import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
	id: number;
	documentId: string;
	username: string;
	email: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
}

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set(() => ({ user })),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
