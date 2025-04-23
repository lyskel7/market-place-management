'use client';

import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <Box
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
  >
    <CircularProgress sx={{ width: 60, height: 60 }} />
  </Box>
);

export default LoadingSpinner;
