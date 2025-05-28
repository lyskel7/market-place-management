'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Image from 'next/image';

const ImageStock = {
  opening: '/opening.jpg',
  leaving: '/leaving.jpg',
  changing: '/changing.jpg',
};

const ImageLoaderApp = ({
  imageStock,
}: {
  imageStock: keyof typeof ImageStock;
}) => {
  // Cotroling visibility and of course, the Fade
  const [showImage, setShowImage] = useState(false);

  // During (milliseconds)
  const FADE_ANIMATION_DURATION = 2000;
  const VISIBLE_DURATION = 3000; // How long time the image stay visible after FadeIn

  useEffect(() => {
    let fadeInTimer;
    let fadeOutTimer;

    // 1. Starting Fade In after a brief instant (displaying the transition)
    // O maybe immediately if prefered
    fadeInTimer = setTimeout(() => {
      setShowImage(true); // Fade in
    }, 100); // A little delay to surethe initial state 'false' make the render

    // 2. Fade out
    // Should be after fade in has been completed nad the image visible
    fadeOutTimer = setTimeout(
      () => {
        setShowImage(false);
      },
      100 + FADE_ANIMATION_DURATION + VISIBLE_DURATION,
    );

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <Box
      position={'relative'}
      width={'100vw'}
      height={'100vh'}
      sx={{ backgroundColor: 'white' }}
    >
      <Fade
        in={showImage}
        timeout={FADE_ANIMATION_DURATION}
      >
        <Image
          alt={`Image ${imageStock}`}
          src={ImageStock[imageStock]}
          fill={true}
          style={{
            objectFit: 'contain',
          }}
          priority
        />
      </Fade>
    </Box>
  );
};

export default ImageLoaderApp;
