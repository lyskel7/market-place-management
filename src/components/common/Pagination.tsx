'use client';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';

type TPaginationprops = {
  count: number;
};

const CategoriesPagination = (props: TPaginationprops) => {
  const { count } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log('page', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[1, 10, 25]}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default CategoriesPagination;
