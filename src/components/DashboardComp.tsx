import { Box } from '@mui/material';
import DashboardCard from './common/DashboardCard';
import { ETypes } from '@/lib/enums';

const DashboardComp = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={2}
    >
      <DashboardCard
        goto="/categories"
        title="Categories"
        body="Section to manage general categories of the app"
        iconName="Class"
        etype={ETypes.CATEGORY}
      />
      <DashboardCard
        goto="/subcategories"
        title="Subcategories"
        body="Section for managing the subcategories belonging to each category"
        iconName="TurnedIn"
        etype={ETypes.SUBCATEGORY}
      />
    </Box>
  );
};

export default DashboardComp;
