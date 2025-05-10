import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import { Dispatch, SetStateAction } from 'react';

type TConfirmationDialogProps = {
  title: string;
  message: string;
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
  onAccept: VoidFunction;
};

export default function ConfirmationDialog(props: TConfirmationDialogProps) {
  const { title, message, open, onOpen, onAccept } = props;

  console.log('ConfirmationDialog props:');

  const handleClose = () => {
    onOpen(false);
  };

  const handleAccept = () => {
    onOpen(false);
    onAccept();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slots={{ transition: Fade }}
      keepMounted
      aria-describedby="confirmation-dialog"
      closeAfterTransition={false}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAccept}>Accept</Button>
      </DialogActions>
    </Dialog>
  );
}
