import BadgeIcon from '@mui/icons-material/Badge';
import BarChartIcon from '@mui/icons-material/BarChart';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import GroupIcon from '@mui/icons-material/Group';
import PinIcon from '@mui/icons-material/Pin';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Branding, NavigationItem } from '@toolpad/core/AppProvider';
import { TNavigationPages } from '../interfaces';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const DASHBOARD: NavigationItem[] = [
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
];

const CLASSIFIER: NavigationItem[] = [
  { kind: 'divider' },
  { kind: 'header', title: 'Classifier' },
  {
    segment: 'categories',
    title: 'Categories',
    icon: <ClassIcon />,
  },
  {
    segment: 'subcategories',
    title: 'Subcategories',
    icon: <TurnedInIcon />,
  },
  {
    segment: 'variations',
    title: 'Variations',
    icon: <WysiwygIcon />,
  },
  {
    segment: 'attributes',
    title: 'Attributes',
    icon: <FormatShapesIcon />,
  },
];

const STATS: NavigationItem[] = [
  { kind: 'divider' },
  { kind: 'header', title: 'Stats' },
  {
    segment: 'stats',
    title: 'Stats',
    icon: <BarChartIcon />,
  },
];

const PROFILE: NavigationItem[] = [
  { kind: 'divider' },
  { kind: 'header', title: 'Profile' },
  {
    segment: 'profile/password',
    title: 'Change password',
    icon: <PinIcon />,
  },
  {
    segment: 'profile/info',
    title: 'Profile info',
    icon: <BadgeIcon />,
  },
];

const USER: NavigationItem[] = [
  { kind: 'divider' },
  { kind: 'header', title: 'Users management' },
  {
    segment: 'users',
    title: 'Users',
    icon: <GroupIcon />,
  },
];

export const BRANDING: Branding = {
  title: 'Market Service Dashboard',
  logo: <MiscellaneousServicesIcon />,
};

export const allNavigationPages: TNavigationPages[] = [
  { id: 'dashboard', component: DASHBOARD, path: '', children: ['/'] },
  {
    id: 'classifier',
    component: CLASSIFIER,
    path: 'classifier',
    children: ['/categories', '/subcategories', '/variations', '/attributes'],
  },
  { id: 'stats', component: STATS, path: 'stats', children: ['/stats'] },
  {
    id: 'profile',
    component: PROFILE,
    path: 'profile',
    children: ['/profile/password', '/profile/info'],
  },
  { id: 'user', component: USER, path: 'user', children: ['/users'] },
];

export const pagePermissions: { [key: string]: string[] } = {
  ADMINS: ['DASHBOARD', 'CLASSIFIER', 'STATS', 'PROFILE', 'USER'],
  EDITORS: ['DASHBOARD', 'CLASSIFIER', 'STATS', 'PROFILE'],
  VIEWERS: ['DASHBOARD', 'STATS', 'PROFILE'],
};
