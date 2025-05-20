'use client';
import * as MuiIcons from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { ERoles } from '@/lib/enums';
// import { useAuthStore } from '@/lib/stores/authStore';
import MuiIconRender from './MuiIconRender';

type TProps = {
  goto: string;
  title: string;
  body: string;
  iconName: keyof typeof MuiIcons;
  count: number;
};

const DashboardCard = (props: TProps) => {
  const { title, body, iconName, count } = props;
  // const { goto, title, body, iconName, count } = props;
  // const userInfo = useAuthStore((state) => state.userInfo);
  // const router = useRouter();

  // const handleOnClick = () => {
  //   if (userInfo?.groups?.[0] !== ERoles.VIEWERS) {
  //     router.push(goto);
  //   }
  // };

  return (
    <Card sx={{ width: 345, borderRadius: 3, height: 150 }}>
      <CardHeader
        action={
          <IconButton
            // disabled={userInfo?.groups?.[0] === ERoles.VIEWERS}
            aria-label="categories"
            // onClick={handleOnClick}
          >
            <MuiIconRender iconName={iconName} />
          </IconButton>
        }
        title={title}
        subheader={<Typography variant="caption">Total: {count}</Typography>}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            overflow: 'auto',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '2',
          }}
        >
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
