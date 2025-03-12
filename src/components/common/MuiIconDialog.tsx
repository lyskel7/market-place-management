'use client';
import useResponsive from '@/lib/hooks/useResponsive';
import * as MuiIcons from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useState,
} from 'react';

type TOpenIcons = {
  openIcons: boolean;
  onOpenIcons: Dispatch<SetStateAction<boolean>>;
  onSelection: (iconName: keyof typeof MuiIcons) => void;
};

const MuiIconDialog = (props: TOpenIcons) => {
  const { openIcons, onOpenIcons, onSelection } = props;
  const { isMobile } = useResponsive();
  const regex = /^[A-Za-z]+(?<!Outlined|Rounded|Sharp|TwoTone)$/;
  const iconNames = (Object.keys(MuiIcons) as (keyof typeof MuiIcons)[]).filter(
    (icon) => icon.search(regex) > -1,
  );
  const [filterIcon, setFilterIcon] =
    useState<(keyof typeof MuiIcons)[]>(iconNames);
  const [filterText, setFilterText] = useState('');

  const handleClose = () => {
    setFilterText('');
    setFilterIcon(iconNames);
    onOpenIcons(false);
  };

  const handlefilterTextOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFilterText(value);
    const lowerValue = value.toLowerCase();
    const filteredIcons = iconNames.filter((icon) =>
      (icon as string).toLowerCase().includes(lowerValue),
    );
    setFilterIcon(filteredIcons || iconNames);
  };

  return (
    <Fragment>
      <Dialog
        fullScreen={isMobile}
        open={openIcons}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth={'xs'}
        closeAfterTransition={false}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
            >
              Choose icon for category
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Stack alignItems={'center'}>
          <DialogActions sx={{ width: 1 }}>
            <TextField
              fullWidth
              focused
              placeholder="Type a suggestive description"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                },
              }}
              value={filterText}
              onChange={handlefilterTextOnChange}
            />
          </DialogActions>
        </Stack>
        <DialogContent dividers={true}>
          <Box
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}
            alignContent={'flex-start'}
            flexWrap={'wrap'}
            gap={1}
          >
            {filterIcon.map((icon) => {
              const IconComponent = MuiIcons[icon];
              return (
                <Box
                  key={icon}
                  component={'div'}
                  borderRadius={1}
                  p={1}
                  display={'flex'}
                  alignItems={'center'}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                      broderColor: 'primary.main',
                    },
                  }}
                  onClick={() => {
                    onSelection(icon);
                    handleClose();
                  }}
                >
                  <IconComponent />
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default MuiIconDialog;
