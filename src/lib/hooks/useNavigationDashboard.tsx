'use client';
import { Navigation } from '@toolpad/core/AppProvider';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { allNavigationPages, pagePermissions } from '../config/navigation';
import { useAuthStore } from '../stores/authStore';

const useNavigationDashboard = () => {
  const { firstGroup } = useAuthStore(
    useShallow((state) => ({
      firstGroup: state.userInfo?.groups?.[0],
    })),
  );

  console.log('useNavigationDashboard: RENDER. GroupsKey:', firstGroup);

  const navigationResult = useMemo(() => {
    console.log(
      'useNavigationDashboard: RECALCULATING navigationResult. Based on groupsKey:',
      firstGroup,
    );

    const menu: Navigation = [];

    if (firstGroup) {
      const permissionsForRole = pagePermissions[firstGroup];
      if (permissionsForRole) {
        permissionsForRole.forEach((pageId) => {
          const matchedPage = allNavigationPages.find(
            (nPage) => nPage.id.toUpperCase() === pageId.toUpperCase(),
          );
          if (matchedPage) {
            for (const element of matchedPage.component) {
              menu.push(element);
            }
          }
        });
      } else {
        console.warn(`No permissions found for role: ${firstGroup}`);
      }
    } else {
      console.log('No role found, navigation will be empty.');
    }
    return menu;
  }, [firstGroup]);

  // ¡MEMOIZAR EL OBJETO DEVUELTO!
  // const result = useMemo(() => {
  //   return navigationResult,
  //   };
  // }, [navigationResult]); // Solo crea un nuevo objeto si navigationResult (el array) cambia su referencia.

  return navigationResult;
};

export default useNavigationDashboard;
