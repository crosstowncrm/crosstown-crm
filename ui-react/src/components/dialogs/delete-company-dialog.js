import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation, gql } from "@apollo/client";

const DELETE_COMPANY = gql`
  mutation deleteCompany($companyId: String) {
    deleteCompany(companyId: $companyId)
  }
`;

export default function DeleteCompanyDialog({
  isOpen,
  handleClose,
  companyId,
  refetch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    deleteCompany({
      variables: { companyId: companyId },
    });
    handleClose();
  };
  const [
    deleteCompany,
    { loading: duMutationLoading, error: duMutationError },
  ] = useMutation(DELETE_COMPANY, {
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
