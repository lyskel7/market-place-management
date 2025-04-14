import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import LinearProgress from '@mui/material/LinearProgress';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import BarChartIcon from '@mui/icons-material/BarChart';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import type { Navigation } from '@toolpad/core/AppProvider';
import theme from '@/styles/theme';
import { ReactNode, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import ReactQueryProviders from '@/lib/provider/reactqueryProvider';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';

const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Classifier',
  },
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
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Stats',
  },
  {
    segment: 'stats',
    title: 'Stats',
    icon: <BarChartIcon />,
  },
];

const BRANDING = {
  title: 'Dashboard',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-toolpad-color-scheme="light"
      suppressHydrationWarning
    >
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Suspense fallback={<LinearProgress />}>
            <NextAppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              theme={theme}
            >
              <ReactQueryProviders>{props.children}</ReactQueryProviders>
              <ToastContainer
                position="top-right"
                autoClose={3000}
              />
            </NextAppProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
