import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { ReactNode } from 'react';

export default function DashboardPagesLayout(props: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <PageContainer>{props.children}</PageContainer>
    </DashboardLayout>
  );
}
// 'use client';
// import { BRANDING } from '@/lib/config/navigation';
// import useNavigationDashboard from '@/lib/hooks/useNavigationDashboard';
// import { useAuthStore } from '@/lib/stores/authStore';
// import {
//   Backdrop,
//   Box,
//   CircularProgress,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import { Authentication } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { NextAppProvider } from '@toolpad/core/nextjs';
// import { PageContainer } from '@toolpad/core/PageContainer';
// import { signOut } from 'aws-amplify/auth';
// import { useRouter } from 'next/navigation';
// import { ReactNode, useEffect, useMemo, useState } from 'react';

// const Layout = ({ children }: { children: ReactNode }) => {
//   // const { BRANDING, NAVIGATION } = useNavigationDashboard();
//   const NAVIGATION = useNavigationDashboard();
//   // const [session, setSession] = useState<Session | null>(null);
//   const [isSigningOut, setIsSigningOut] = useState(false);
//   const { push } = useRouter();
//   const theme = useTheme();
//   const clearAuth = useAuthStore((state) => state.clearAuth); // Selector separado para clearAuth
//   const useremail = useAuthStore((state) => state.userInfo?.email);
//   // const { avatarUrl, error, refreshUrl } = useAvatarUrl();
//   const username = useAuthStore((state) => {
//     console.log(
//       'Layout.tsx: Selecting userInfo from store. Current name:',
//       state.userInfo?.name,
//     );
//     // Loguea la referencia para ver si cambia:
//     // console.log('Layout.tsx: userInfo reference:', state.userInfo); // Puede ser muy verboso
//     return state.userInfo?.name;
//   });
//   // useEffect(() => {
//   //   if (error) {
//   //     toast.error(`Failed to load avatar: ${error.message}`);
//   //     setSession(null);
//   //    return;
//   //   }

//   //   setSession({
//   //     user: {
//   //       name: userInfo?.name || 'No name provided',
//   //       email: userInfo?.email || 'No email provided',
//   //       image: avatarUrl || '',
//   //     },
//   //   });
//   // }, [avatarUrl, error, userInfo]);

//   const session = useMemo(() => {
//     // if (error) {
//     //   // Podrías querer manejar el error de forma diferente
//     //   return null;
//     // }
//     return {
//       user: {
//         name: username || '...',
//         email: useremail || '...',
//         // image: avatarUrl || '',
//       },
//     };
//   }, [useremail, username]);

//   useEffect(() => {
//     console.log(
//       'Layout.tsx EFFECT: session reference changed or component remounted.',
//     );
//   }, [session]); // Solo se ejecuta si la referencia de session cambia

//   console.log('Layout.tsx RENDER');
//   // useEffect(() => {
//   //   const handleVisibilityChange = () => {
//   //     if (document.visibilityState === 'visible') {
//   //       refreshUrl(false); // Refresh the URL when the tab is visible and without loading
//   //     }
//   //   };

//   //   document.addEventListener('visibilitychange', handleVisibilityChange);
//   //   return () =>
//   //     document.removeEventListener('visibilitychange', handleVisibilityChange);
//   // }, [refreshUrl]); // refreshUrl is memoized by useCallback

//   // Listening to timestamp in store
//   // useEffect(() => {
//   //   console.log(
//   //     'Avatar timestamp changed in store, refreshing SessionAccount avatar.',
//   //   );
//   //   refreshUrl(false);
//   // }, [refreshUrl]);

//   // const authentication: Authentication = useMemo(() => {
//   //   return {
//   //     signIn: () => {},
//   //     signOut: async () => {
//   //       setIsSigningOut(true);
//   //       try {
//   //         await signOut();
//   //         clearAuth();
//   //         push('/auth/signin');
//   //       } catch (error) {
//   //         console.error('Error during sign out:', error);
//   //         setIsSigningOut(false);
//   //       }
//   //     },
//   //   };
//   // }, [clearAuth, push]);

//   return (
//     <NextAppProvider
//       navigation={NAVIGATION}
//       branding={BRANDING}
//       session={session}
//       authentication={authentication}
//     >
//       <DashboardLayout>
//         <PageContainer>{children}</PageContainer>
//       </DashboardLayout>
//       <Backdrop
//         open={isSigningOut}
//         sx={{
//           backgroundColor: theme.palette.background.paper,
//           color:
//             theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
//           zIndex: 9999,
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <CircularProgress color="inherit" />
//           <Typography
//             sx={{ mt: 2 }}
//             color="text.primary"
//           >
//             Signing out...
//           </Typography>
//         </Box>
//       </Backdrop>
//     </NextAppProvider>
//   );
// };

// // Función de comparación para React.memo
// // const areLayoutPropsEqual = (
// //   prevProps: LayoutProps,
// //   nextProps: LayoutProps,
// // ) => {
// //   // Compara solo las props que SÍ usas y que SÍ deberían causar un re-render si cambian.
// //   // En este caso, solo `children`.
// //   // IGNORAMOS `params` porque `LayoutInner` no lo usa.
// //   return prevProps.children === nextProps.children;
// //   // Nota: Comparar `children` por referencia (===) es a menudo suficiente si el padre
// //   // no está recreando innecesariamente el nodo children. Si children es complejo y
// //   // su referencia cambia pero su contenido no, necesitarías una comparación más profunda
// //   // o memoizar children en el padre. Pero empecemos simple.
// // };

// // export default memo(LayoutInner, areLayoutPropsEqual);

// export default Layout;
