'use client';
import { ETypes } from '@/lib/enums';
import useFetcherTotal from '@/lib/hooks/useFetcherTotal';
import * as MuiIcons from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MuiIconRender from './MuiIconRender';
import { useEffect } from 'react';

type TProps = {
  goto: string;
  title: string;
  body: string;
  iconName: keyof typeof MuiIcons;
  etype: ETypes;
};
const DashboardCard = (props: TProps) => {
  const { goto, etype, title, body, iconName } = props;
  const router = useRouter();

  const { count, refetch, isLoading } = useFetcherTotal(etype);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, height: 150 }}>
      {isLoading && <LinearProgress />}
      <CardHeader
        action={
          <IconButton
            aria-label="categories"
            onClick={() => router.push(goto)}
          >
            <MuiIconRender iconName={iconName} />
          </IconButton>
        }
        title={title}
        subheader={
          <Typography variant="caption">Total: {count ?? 0}</Typography>
        }
      />
      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
