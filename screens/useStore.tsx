// stores/useStore.ts
import create from 'zustand';

interface User {
  idUser: number,
  name: string;
  lastname: string;
  email: string;
  birthdate: string;
  role: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;