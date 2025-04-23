'use client';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { useEffect } from 'react';
// import { configureAmplify } from '@/lib/amplify/amplify';
// import theme from '@/styles/theme';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   configureAmplify();
  // }, []);

  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
