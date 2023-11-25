import { type FC } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { isNil } from "lodash";

interface Props {
  isOpen: boolean;
  title: string;
  content?: string;
  handleClose: () => void;
  handleDisagree: () => void;
  handleAgree: () => void;
}

const AlertDialog: FC<Props> = (props) => {
  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        {!isNil(props.content) && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{props.content}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={props.handleDisagree}>Disagree</Button>
          <Button onClick={props.handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
