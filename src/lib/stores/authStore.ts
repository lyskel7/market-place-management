'use client';
import { create } from 'zustand';
import { SchemaType } from '../apis/amplifyDB';
import { ERoles } from '../enums';
import { isEqual } from 'lodash';

export type TOpenCloseApp = 'opening' | 'closing' | 'changing' | 'none';

export interface IUserInfo {
  email?: string;
  name?: string;
  username?: string;
  picture?: string | null;
  id?: string;
  groups?: string[] | null;
}

type TAuthStoreState = {
  userRoles: ERoles[];
  openClosing: TOpenCloseApp;
  isHydrating: boolean;
  isAuth: boolean;
  userInfo: IUserInfo | null;
  avatarUpdateTimestamp: number;
  userForEdit: Partial<SchemaType> | null;
};

type TAuthStoreActions = {
  setIsHydrating: (hydrating: boolean) => void;
  setUserInfo: (info: IUserInfo | null) => void;
  setIsAuth: (isAuth: boolean) => void;
  notifyAvatarUpdate: () => void;
  setUserForEdit: (user: Partial<SchemaType> | null) => void;
  clearAuth: () => void; //For logout
};

const initialState: TAuthStoreState = {
  userRoles: [],
  isHydrating: false,
  isAuth: false,
  userInfo: null,
  avatarUpdateTimestamp: Date.now(),
  userForEdit: null,
  openClosing: 'none',
};

export const useAuthStore = create<TAuthStoreState & TAuthStoreActions>()(
  (set, get) => ({
    ...initialState,
    notifyAvatarUpdate: () => set({ avatarUpdateTimestamp: Date.now() }),
    setUserInfo: (newUserInfo: IUserInfo | null) => {
      const currentUserInfo = get().userInfo; // Getting current state
      if (!isEqual(currentUserInfo, newUserInfo)) {
        // Deeply comparison
        console.log('AuthStore: UserInfo DEEPLY changed, updating state.');
        set({ userInfo: newUserInfo });
      } else {
        console.log(
          'AuthStore: UserInfo is the same (deep compare), NO STATE UPDATE.',
        );
      }
    },
    setIsHydrating: (isHydrating) => set({ isHydrating }),
    setIsAuth: (isAuth) => set({ isAuth }),
    setUserForEdit: (user) => set({ userForEdit: user }),
    clearAuth: () => {
      set({
        ...initialState,
        openClosing: 'closing',
      });
    },
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
