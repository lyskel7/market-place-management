'use client';
import * as MuiIcons from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MuiIconRender from './MuiIconRender';

type TProps = {
  goto: string;
  title: string;
  body: string;
  iconName: keyof typeof MuiIcons;
  count: number;
};

const DashboardCard = (props: TProps) => {
  const { goto, title, body, iconName, count } = props;
  const router = useRouter();

  return (
    <Card sx={{ width: 345, borderRadius: 3, height: 150 }}>
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
