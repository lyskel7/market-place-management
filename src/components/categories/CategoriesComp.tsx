'use client';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  // Paper,
  Stack,
  Typography,
} from '@mui/material';
import CategoryComp from './CategoryComp';
// import CategoriesPagination from '../common/Pagination';
import useCategoriesFetcher from '@/lib/hooks/useCategoriesFetcher';
import { useCallback, useRef } from 'react';
import { ICategory } from '@/lib/interfaces';
import { toast } from 'react-toastify';
import { useCategoryStore } from '@/lib/stores';
import { useShallow } from 'zustand/react/shallow';

const CategoriesComp = () => {
  const {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
    refetch,
  } = useCategoriesFetcher();

  const { onRefetch } = useCategoryStore(
    useShallow((state) => ({
      onRefetch: state.onRefetch,
    })),
  );

  const observer = useRef<IntersectionObserver | null>(null);
  onRefetch(refetch);

  const lastCategoryRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            console.log('Visible, fetching next page');
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

  if (isLoading) {
    return <div>Cargando categorías...</div>;
  }

  if (isError) {
    toast.error(error?.message, {
      autoClose: false,
      toastId: 'categoryErrorId',
    });
    return;
  }

  const categories: ICategory[] = items || [];

  return (
    <>
      <Button
        sx={{ alignSelf: 'flex-end' }}
        onClick={() => refetch()}
      >
        Reload
      </Button>

      <Stack
        gap={2}
        height={500}
        overflow={'auto'}
      >
        <List
          sx={{ width: 1, height: 1, flex: 1 }}
          id="scrollableDiv"
        >
          {categories?.map((cat, index) => {
            const isLastElement = categories.length === index + 1;
            return (
              <CategoryComp
                key={cat.PK}
                ref={isLastElement ? lastCategoryRef : null}
                category={cat}
                onRefetch={refetch}
              />
            );
          })}
          {isFetchingNextPage && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    Cargando más categorías...
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>

        {/* <CategoriesPagination count={count} /> */}
      </Stack>
    </>
  );
};

export default CategoriesComp;
