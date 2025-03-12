'use client'
import React from 'react'
import * as MuiIcons from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface MuiIconRenderProps {
  iconName: keyof typeof MuiIcons;
  sx?: SxProps<Theme>
}

const MuiIconRender: React.FC<MuiIconRenderProps> = ({ iconName, sx }) => {
  const IconComponent = MuiIcons[iconName];
  return IconComponent ? <IconComponent sx={sx} /> : null;
}

export default MuiIconRender