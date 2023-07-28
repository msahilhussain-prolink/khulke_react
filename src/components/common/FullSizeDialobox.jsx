import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { DialogContent } from '@mui/material';
import { CancelOutlined } from '@material-ui/icons';
import { DialogStyle } from './DialogStyle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const { children, open, setOpen } = props;


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
            style: DialogStyle.dialog
          }}
      >
            <IconButton
            style={DialogStyle.icon}
              edge="start"
              onClick={handleClose}
              aria-label="close"
            >
              <CancelOutlined />
            </IconButton>
        <DialogContent sx={DialogStyle.dialogContent}>
        {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}