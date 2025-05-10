'use client';
import useFetcherCognitoUsers from '@/lib/hooks/useFetcherCognitoUsers';
import { List } from '@mui/material';
import { toast } from 'react-toastify';
import UserComp from './UserComp';

const ListUserComp = () => {
  const { data, isError, error, isLoading, refetch } = useFetcherCognitoUsers();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    toast.error(error?.message, {
      autoClose: false,
      toastId: 'UsersCognitoErrorId',
    });
    return;
  }

  return (
    <List>
      {data?.map((user) => (
        <UserComp
          key={user.id}
          user={user}
          onRefresh={refetch}
        />
      ))}
    </List>
  );
};

export default ListUserComp;
