'use client';
import useFetcherTotal from '@/lib/hooks/useFetcherTotal';
import * as MuiIcons from '@mui/icons-material';
import { Box, LinearProgress } from '@mui/material';
import DashboardCard from './common/DashboardCard';

export type TTotalsDescription = {
  name: string;
  key: string;
  goto: string;
  title: string;
  body: string;
  iconName: keyof typeof MuiIcons;
  count: number;
};
const totalsDescription: TTotalsDescription[] = [
  {
    name: 'category',
    key: 'dashboardCard1',
    goto: '/categories',
    title: 'Categories',
    body: 'Section to manage general categories of the app',
    iconName: 'Class',
    count: 0,
  },
  {
    name: 'subcategory',
    key: 'dashboardCard2',
    goto: '/subcategories',
    title: 'Subcategories',
    body: 'Section for managing the subcategories belonging to each category',
    iconName: 'TurnedIn',
    count: 0,
  },
];

const DashboardComp = () => {
  const { data, isLoading } = useFetcherTotal();

  console.log('couont: ', data);

  const items = data.map((v) => {
    const found = totalsDescription.find((item) => item.name === v.pk);
    return {
      ...found,
      count: v.count,
    };
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box
      display={'flex'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
      gap={2}
    >
      {items.map((item) => (
        <DashboardCard
          key={item.key}
          goto={item.goto || '/default-path'}
          title={item.title || 'Default Title'}
          body={item.body || 'Default Body'}
          iconName={item.iconName || 'Apps'}
          count={item.count || 0}
        />
      ))}
    </Box>
  );
};

export default DashboardComp;
