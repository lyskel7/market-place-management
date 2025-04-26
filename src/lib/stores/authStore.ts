'use client';
// import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
// import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

interface IUserInfo {
  email?: string;
  name?: string;
  username?: string;
  sub?: string;
  groups?: string[] | null;
  picture?: string;
}

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: IUserInfo | null;
  setAuthenticated: (auth: boolean) => void;
  setUserInfo: (info: IUserInfo | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  // persist(
  (set) => ({
    isAuthenticated: false,
    userRoles: [],
    isLoading: true,
    userInfo: null,
    setAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setUserInfo: (info) => set({ userInfo: info }),
    setLoading: (loading) => set({ isLoading: loading }),
    clearAuth: () =>
      set({
        isAuthenticated: false,
        isLoading: false,
        userInfo: {},
      }),
  }),
  // {
  //   name: 'auth-storage', // localStorage key
  //   partialize: (state) => ({
  //     isAuthenticated: state.isAuthenticated,
  //   }),
  //   onRehydrateStorage: () => (state) => {
  //     state?.setHasHydrated(true);
  //   },
  // },
  // ),
);

// interface AuthState {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   userRoles: string[] | null;
//   hasHydrated: boolean;
//   setAuthenticated: (value: boolean) => void;
//   setLoading: (value: boolean) => void;
//   setUserRoles: (roles: string[] | null) => void;
//   setHasHydrated: (value: boolean) => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   isLoading: true,
//   userRoles: [],
//   hasHydrated: false,
//   setAuthenticated: (value) => set({ isAuthenticated: value }),
//   setLoading: (value) => set({ isLoading: value }),
//   setUserRoles: (roles) => set({ userRoles: roles }),
//   setHasHydrated: (value) => set({ hasHydrated: value }),
// }));

// interface IAuthState {
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   userRoles: string[] | null;
//   error: Error | null;
//   checkAuthStatus: () => Promise<void>;
//   clearAuthStatus: () => Promise<void>;
//   // isAuthenticated: boolean;
//   // roles: string[];
//   isHydrated: boolean; // Nuevo flag para indicar si los datos fueron rehidratados
//   // setAuth: (isAuthenticated: boolean, roles: string[]) => void;
//   // setHydrated: (value: boolean) => void;
// }

// type TPersistedAuthState = Pick<IAuthState, 'isAuthenticated' | 'userRoles'>;

// // 3. Opciones de persistencia (sin cambios, pero asegúrate de que `partialize` esté bien)
// const persistOptions: PersistOptions<IAuthState, TPersistedAuthState> = {
//   name: 'auth-storage',
//   storage: createJSONStorage(() => localStorage),
//   partialize: (state: IAuthState): TPersistedAuthState => ({
//     isAuthenticated: state.isAuthenticated,
//     userRoles: state.userRoles,
//   }),
//   // Opcional: Podrías querer un onRehydrateStorage para manejar la carga inicial
//   onRehydrateStorage: () => (state) => {
//     console.log('✅ Hydration finished, updating isLoading...');
//     // Cuando se termina de hidratar, marcamos como cargado
//     if (state) {
//       state.isLoading = false;
//     }
//   },
// };

// export const useAuthStore = create<IAuthState>()(
//   // create solo necesita el estado completo
//   // --- 👇 Proporciona todos los tipos genéricos a persist ---
//   // 1. IAuthState: El estado completo en memoria.
//   // 2. []: Middlewares que se ejecutan *antes* de persist (ninguno en este caso).
//   // 3. []: Middlewares que se ejecutan *después* de persist (ninguno en este caso).
//   // 4. TPersistedAuthState: El estado que realmente se guarda/lee.
//   persist<IAuthState, [], [], TPersistedAuthState>(
//     // --- 👇 La función creadora normal, sin tipos de middleware explícitos aquí ---
//     (set) => ({
//       isLoading: true, // Empezar cargando
//       isAuthenticated: false,
//       userRoles: null,
//       error: null,
//       checkAuthStatus: async () => {
//         // set({ isLoading: true, error: null }); // No es necesario si isLoading empieza en true
//         try {
//           console.log('checkAuthStatus: Fetching session...');
//           const session = await fetchAuthSession(/*{ forceRefresh: true }*/);
//           const idTokenPayload = session.tokens?.idToken?.payload;
//           const groups =
//             idTokenPayload && Array.isArray(idTokenPayload['cognito:groups'])
//               ? (idTokenPayload['cognito:groups'] as string[])
//               : null;
//           console.log('checkAuthStatus: Session found, setting state.');
//           set(
//             {
//               isAuthenticated: !!session.tokens,
//               userRoles: groups,
//               isLoading: false,
//               error: null,
//             },
//             false,
//           ); // Añadir etiqueta opcional para debug
//         } catch (error) {
//           console.log('checkAuthStatus: No active session or error:', error);
//           set(
//             {
//               isAuthenticated: false,
//               userRoles: null,
//               isLoading: false,
//               error:
//                 error instanceof Error ? error : new Error('Auth check failed'),
//             },
//             false,
//           ); // Añadir etiqueta opcional para debug
//         }
//       },
//       clearAuthStatus: async () => {
//         // set({ isLoading: true }); // Opcional
//         try {
//           console.log('clearAuthStatus: Signing out...');
//           await signOut();
//           console.log('clearAuthStatus: Sign out successful.');
//         } catch (error) {
//           console.error('clearAuthStatus: Error during sign out:', error);
//         } finally {
//           console.log('clearAuthStatus: Clearing local state.');
//           set(
//             {
//               isAuthenticated: false,
//               userRoles: null,
//               isLoading: false,
//               error: null,
//             },
//             false,
//           ); // Añadir etiqueta opcional para debug
//         }
//       },
//     }),
//     // --- 👆 Fin de la función creadora ---
//     persistOptions, // Pasa el objeto de opciones tipado
//   ),
// );

// type TPersistedAuthState = Pick<IAuthState, 'isAuthenticated' | 'userRoles'>;

// const persistOptions: PersistOptions<IAuthState, TPersistedAuthState> = {
//   name: 'auth-storage',
//   storage: createJSONStorage(() => localStorage),
//   partialize: (state: IAuthState): TPersistedAuthState => ({
//     isAuthenticated: state.isAuthenticated,
//     userRoles: state.userRoles,
//   }),
//   onRehydrateStorage: () => (state) => {
//     console.log('✅ Hydration finished, updating isLoading...');
//     // Cuando se termina de hidratar, marcamos como cargado
//     if (state) {
//       state.isLoading = false;
//       state.isHydrated = true; // Marcamos que la rehidratación se completó
//     }
//   },
// };

// export const useAuthStore = create<IAuthState>()(
//   persist<IAuthState, [], [], TPersistedAuthState>(
//     (set, get) => ({
//       isLoading: true, // Empezamos cargando
//       isAuthenticated: false,
//       userRoles: null,
//       isHydrated: false, // Inicialmente no ha sido rehidratado
//       error: null,
//       checkAuthStatus: async () => {
//         // Solo se ejecuta si ya ha sido rehidratado
//         const state = get();
//         if (!state.isHydrated) return;

//         try {
//           console.log('checkAuthStatus: Fetching session...');
//           const session = await fetchAuthSession(/*{ forceRefresh: true }*/);
//           const idTokenPayload = session.tokens?.idToken?.payload;
//           const groups =
//             idTokenPayload && Array.isArray(idTokenPayload['cognito:groups'])
//               ? (idTokenPayload['cognito:groups'] as string[])
//               : null;
//           console.log('checkAuthStatus: Session found, setting state.');
//           set(
//             {
//               isAuthenticated: !!session.tokens,
//               userRoles: groups,
//               isLoading: false,
//               error: null,
//             },
//             false,
//           );
//         } catch (error) {
//           console.log('checkAuthStatus: No active session or error:', error);
//           set(
//             {
//               isAuthenticated: false,
//               userRoles: null,
//               isLoading: false,
//               error:
//                 error instanceof Error ? error : new Error('Auth check failed'),
//             },
//             false,
//           );
//         }
//       },
//       clearAuthStatus: async () => {
//         try {
//           console.log('clearAuthStatus: Signing out...');
//           await signOut();
//           console.log('clearAuthStatus: Sign out successful.');
//         } catch (error) {
//           console.error('clearAuthStatus: Error during sign out:', error);
//         } finally {
//           console.log('clearAuthStatus: Clearing local state.');
//           set(
//             {
//               isAuthenticated: false,
//               userRoles: null,
//               isLoading: false,
//               error: null,
//               isHydrated: false, // Resetear estado de hidratación al hacer logout
//             },
//             false,
//           );
//         }
//       },
//     }),
//     persistOptions,
//   ),
// );
