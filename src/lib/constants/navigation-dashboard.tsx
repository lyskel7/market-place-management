'use client';
import BarChartIcon from '@mui/icons-material/BarChart';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import { Navigation } from '@toolpad/core/AppProvider';

export const NAVIGATION: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  { kind: 'divider' },
  { kind: 'header', title: 'Classifier' },
  {
    segment: 'dashboard/categories',
    title: 'Categories',
    icon: <ClassIcon />,
  },
  {
    segment: 'dashboard/subcategories',
    title: 'Subcategories',
    icon: <TurnedInIcon />,
  },
  {
    segment: 'dashboard/variations',
    title: 'Variations',
    icon: <WysiwygIcon />,
  },
  {
    segment: 'dashboard/attributes',
    title: 'Attributes',
    icon: <FormatShapesIcon />,
  },
  { kind: 'divider' },
  { kind: 'header', title: 'Stats' },
  {
    segment: 'dashboard/stats',
    title: 'Stats',
    icon: <BarChartIcon />,
  },
];

export const BRANDING = {
  title: 'Dashboard',
};
