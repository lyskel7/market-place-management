'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

const Unauthorized = () => {
  const [showImage, setShowImage] = useState(false);
  const { push } = useRouter();

  // const FADE_ANIMATION_DURATION = 2000;
  // const VISIBLE_DURATION = 3000;

  useEffect(() => {
    let fadeInTimer;
    // let fadeOutTimer;

    // 1. Starting Fade In after a brief instant (displaying the transition)
    // O maybe immediately if prefered
    fadeInTimer = setTimeout(() => {
      setShowImage(true); // Fade in
    }, 100); // A little delay to surethe initial state 'false' make the render

    // 2. Fade out
    // Should be after fade in has been completed nad the image visible
    // fadeOutTimer = setTimeout(
    //   () => {
    //     setShowImage(false);
    //   },
    //   100 + FADE_ANIMATION_DURATION + VISIBLE_DURATION,
    // );

    return () => {
      clearTimeout(fadeInTimer);
      // clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <Box
      position={'relative'}
      width={'100vw'}
      height={'100vh'}
      overflow={'hidden'}
      sx={{ backgroundColor: 'white' }}
    >
      <Fade
        in={showImage}
        // timeout={FADE_ANIMATION_DURATION}
      >
        <div>
          <Image
            alt={'Unauthorized'}
            src={'/unauthorized.jpg'}
            fill={true}
            style={{
              objectFit: 'contain',
              zIndex: 1,
            }}
            priority
          />
          <Box
            style={{
              position: 'absolute',
              top: '95%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              color: 'white',
            }}
          >
            <Button
              variant="contained"
              color="info"
              onClick={() => push('/')}
            >
              {'Come back'}
            </Button>
            {/* <Link
              href={'/'}
              style={{
                color: 'rgb(0, 0, 255, 0.8)',
                textDecoration: 'underline',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              {'Come back to dashboard'}
            </Link> */}
          </Box>
        </div>
      </Fade>
    </Box>
  );
};

export default Unauthorized;
