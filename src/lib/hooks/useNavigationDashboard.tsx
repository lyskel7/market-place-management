'use client';
// import { Navigation } from '@toolpad/core/AppProvider';
// import { useMemo, useRef } from 'react';
// import { useRef } from 'react';
// import { IUserInfo, useAuthStore } from '../stores/authStore';
import {
  allNavigationPages,
  // BRANDING,
  // pagePermissions,
} from '../config/navigation';

const useNavigationDashboard = () => {
  // const firstGroup = useAuthStore((state) => state.userInfo?.groups?.[0]);
  // const previousUserInfoRef = useRef<IUserInfo | null>(null);
  // const previousGroupsRef = useRef<string[] | undefined>(null);
  // const firstGroup = useAuthStore((state) => {
  //   // Loguear para ver si el objeto userInfo o el array groups cambian de referencia
  //   // ¡Esto puede ser verboso! Solo para depuración temporal.
  //   console.log(
  //     'useNavigationDashboard - Selector: state.userInfo === previous.userInfo?',
  //     Object.is(previousUserInfoRef.current, state.userInfo),
  //   );
  //   // console.log(
  //   //   'useNavigationDashboard - Selector: state.userInfo.groups === previous.groups?',
  //   //   Object.is(previousGroupsRef.current, state.userInfo?.groups),
  //   // );
  //   previousUserInfoRef.current = state.userInfo; // Necesitarías useRefs para esto
  //   // previousGroupsRef.current = state.userInfo?.groups;

  //   return state.userInfo?.groups?.[0];
  // });

  // Para comparar referencias de firstGroup entre renders DEL HOOK MISMO
  // const previousFirstGroupRef = useRef<string | undefined>(null);
  // if (previousFirstGroupRef.current !== firstGroup) {
  //   console.warn(
  //     `useNavigationDashboard: firstGroup REFERENCE CHANGED! Previous: ${previousFirstGroupRef.current}, Current: ${firstGroup}. Same value? ${previousFirstGroupRef.current === firstGroup}`,
  //   );
  //   previousFirstGroupRef.current = firstGroup;
  // } else {
  //   console.log(
  //     `useNavigationDashboard: firstGroup reference is STABLE. Value: ${firstGroup}`,
  //   );
  // }

  // console.log('useNavigationDashboard: RENDER. GroupsKey:', firstGroup);

  // const navigationResult = useMemo(() => {
  //   console.log(
  //     'useNavigationDashboard: RECALCULATING navigationResult. Based on groupsKey:',
  //     firstGroup,
  //   );

  // const menu: Navigation = [];

  //   if (firstGroup) {
  //     const permissionsForRole = pagePermissions[firstGroup];
  //     if (permissionsForRole) {
  //       permissionsForRole.forEach((pageId) => {
  //         const matchedPage = allNavigationPages.find(
  //           (nPage) => nPage.id.toUpperCase() === pageId.toUpperCase(),
  //         );
  //         if (matchedPage) {
  //           for (const element of matchedPage.component) {
  //             menu.push(element);
  //           }
  //         }
  //       });
  //     } else {
  //       console.warn(`No permissions found for role: ${firstGroup}`);
  //     }
  //   } else {
  //     console.log('No role found, navigation will be empty.');
  //   }
  //   return menu;
  // }, [firstGroup]);

  // ¡MEMOIZAR EL OBJETO DEVUELTO!
  // const result = useMemo(() => {
  //   return {
  //     NAVIGATION: navigationResult,
  //     BRANDING, // BRANDING es una constante, así que no necesita estar en las dependencias del useMemo externo
  //   };
  // }, [navigationResult]); // Solo crea un nuevo objeto si navigationResult (el array) cambia su referencia.

  // return result;
  return allNavigationPages[0].component;
};

export default useNavigationDashboard;
