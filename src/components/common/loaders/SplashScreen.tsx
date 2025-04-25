'use client';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const SplashScreen = () => {
  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#42A5F5',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'opacity 0.3s ease',
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default SplashScreen;
