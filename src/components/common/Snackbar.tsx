import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Dispatch, forwardRef, ReactElement, Ref, SetStateAction } from 'react';

type TConfirmationDialogProps = {
  title: string;
  message: string;
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
  onAccept: VoidFunction;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export default function ConfirmationDialog(props: TConfirmationDialogProps) {
  const { title, message, open, onOpen, onAccept } = props;

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
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
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
