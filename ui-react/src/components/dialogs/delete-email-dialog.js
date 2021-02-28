import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation, gql } from "@apollo/client";

const DELETE_EMAIL = gql`
  mutation deleteEmail($emailId: String) {
    deleteEmail(emailId: $emailId)
  }
`;

export default function DeleteEmailDialog({
  isOpen,
  handleClose,
  emailId,
  refetch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    deleteEmail({
      variables: { emailId: emailId },
    });
    handleClose();
  };
  const [
    deleteEmail,
    { loading: duMutationLoading, error: duMutationError },
  ] = useMutation(DELETE_EMAIL, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
