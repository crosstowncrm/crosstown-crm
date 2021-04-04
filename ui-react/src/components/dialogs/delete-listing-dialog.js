import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation, gql } from "@apollo/client";

const DELETE_LISTING = gql`
  mutation deleteListing($listingId: String) {
    deleteListing(listingId: $listingId)
  }
`;

export default function DeleteListingDialog({
  isOpen,
  handleClose,
  listingId,
  refetch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    deleteListing({
      variables: { listingId: listingId },
    });
    handleClose();
  };
  const [deleteListing, { loading, error }] = useMutation(DELETE_LISTING, {
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
