'use client';
import { SCAN_LIMIT } from '@/lib/constants/frontend';
import { ETypes } from '@/lib/enums';
import useFetcher from '@/lib/hooks/useFetcher';
import { useCategoryStore } from '@/lib/stores/categoryStore';
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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import CategoryComp from './CategoryComp';
import { ICategory, IPageParams } from '@/lib/interfaces';

const CategoriesComp = ({ etype }: { etype: ETypes }) => {
  const { catAutocomplete, setListedItems } = useCategoryStore(
    useShallow((state) => ({
      catAutocomplete: state.catAutocomplete,
      setListedItems: state.setListedItems,
    })),
  );

  const initialPageParam: IPageParams = {
    pk: etype,
    limit: SCAN_LIMIT,
    lastEvaluatedKey: undefined,
    ...(etype === ETypes.SUBCATEGORY && catAutocomplete
      ? { sk: catAutocomplete.sk }
      : {}),
  };

  const {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = useFetcher<ICategory>({
    initialPageParam,
    queryKey: [etype],
    enabled: !!catAutocomplete || etype === ETypes.CATEGORY,
  });

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
    queryClient.invalidateQueries({ queryKey: [etype] });
  };

  const shouldRenderList =
    etype === ETypes.CATEGORY ||
    (etype === ETypes.SUBCATEGORY && !!catAutocomplete);

  useEffect(() => {
    setListedItems(items as ICategory[]);
  }, [items, setListedItems]);

  const sortedItems = useMemo(() => {
    return [...(items as ICategory[])].sort((a, b) =>
      a.itemName.localeCompare(b.itemName),
    );
  }, [items]);

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
      {shouldRenderList && (
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
            {sortedItems?.map((cat, index) => {
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
      )}
    </>
  );
};

export default CategoriesComp;
