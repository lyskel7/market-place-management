'use client';
import { SCAN_LIMIT } from '@/lib/constants/frontend';
import { ETypes } from '@/lib/enums';
import useFetcher from '@/lib/hooks/useFetcher';
import { useCategoryStore } from '@/lib/stores';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import CategoryComp from './CategoryComp';

const CategoriesComp = ({ etype }: { etype: ETypes }) => {
  const { selAutocomplete } = useCategoryStore(
    useShallow((state) => ({
      selAutocomplete: state.selAutocomplete,
    })),
  );

  const {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = useFetcher(
    {
      pk: etype,
      limit: SCAN_LIMIT,
      lastEvaluatedKey: undefined,
      ...(etype === ETypes.SUBCATEGORY && selAutocomplete
        ? { sk: selAutocomplete.sk }
        : {}),
    },
    etype,
    !!selAutocomplete || etype === ETypes.CATEGORY,
  );
  const queryClient = useQueryClient();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCategoryRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          root: document.querySelector('#scrollableDiv'),
          rootMargin: '0px',
          threshold: 1.0,
        },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const handleRefetch = () => {
    queryClient.removeQueries({ queryKey: [etype] });
    queryClient.refetchQueries({ queryKey: [etype] });
  };

  if (isLoading) <LinearProgress />;

  if (isError) {
    toast.error(error?.message, {
      autoClose: false,
      toastId: 'categoryErrorId',
    });
    return;
  }

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="caption">
          Loaded {items?.length || 0}
          {`${hasNextPage ? ' and remaining more...' : ' and no more'}`}
        </Typography>
        <Button
          sx={{ alignSelf: 'flex-end' }}
          onClick={handleRefetch}
          startIcon={<ReplayIcon />}
        >
          Reload
        </Button>
      </Box>

      <List
        sx={{
          width: 1,
          height: 500,
          id: 'scrollableDiv', //This id is important for intersection in infinite scroll
          overflow: 'auto',
        }}
      >
        {items?.map((cat, index) => {
          const isLastElement = items.length === index + 1;
          return (
            <CategoryComp
              key={cat.sk}
              ref={isLastElement ? lastCategoryRef : null}
              category={cat}
              etype={etype}
            />
          );
        })}
        {isFetchingNextPage && (
          <ListItem>
            <ListItemText primary={<LinearProgress />} />
          </ListItem>
        )}
      </List>
    </>
  );
};

export default CategoriesComp;
