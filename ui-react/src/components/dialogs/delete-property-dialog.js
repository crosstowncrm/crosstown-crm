import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const DELETE_PROPERTY = gql`
  mutation deleteProperty($propertyId: String) {
    deleteProperty(propertyId: $propertyId)
  }
`;

export default function DeletePropertyDialog({
  isOpen,
  handleClose,
  propertyId,
  refetch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    deleteProperty({
      variables: { propertyId: propertyId },
    });
    handleClose();
  };
  const [
    deleteProperty,
    { loading: duMutationLoading, error: duMutationError },
  ] = useMutation(DELETE_PROPERTY, {
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
