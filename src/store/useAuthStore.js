// import { create } from 'zustand';

// export const useAuthStore = create((set) => ({
//     user: null,
//     isAuthenticated: false,
//     hasHydrated: true,
//     setUser: (user) => set({ user, isAuthenticated: true }),
//     clearUser: () => set({ user: null, isAuthenticated: false }),
// }));


import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    hasHydrated: false,
    setUser: (user) => set({ user, isAuthenticated: true, hasHydrated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false, hasHydrated: true }),
}));