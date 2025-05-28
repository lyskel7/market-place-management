'use client';
import CssBaseline from '@mui/material/CssBaseline';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
