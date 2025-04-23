'use client';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Button
        variant="outlined"
        size="small"
        onClick={() => router.push('/auth/signin')}
      >
        Login
      </Button>
    </main>
  );
};

export default UnauthorizedPage;
