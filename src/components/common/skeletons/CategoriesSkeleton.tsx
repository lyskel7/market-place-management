'use client';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const CategoriesSkeleton = () => {
  return (
    <Stack
      spacing={2}
      width={1}
    >
      {[1, 2, 3].map((_, index) => (
        <Box
          width={'100%'}
          key={index}
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          gap={1}
        >
          <Skeleton
            variant="circular"
            width={65}
            height={50}
          />
          <Stack
            spacing={1}
            width={1}
          >
            <Skeleton
              variant="rectangular"
              width={'75%'}
              height={50}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: '1rem' }}
              width={'75%'}
            />
          </Stack>
          {[1, 2, 3].map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={45}
              height={35}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );
};

export default CategoriesSkeleton;
