import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation, gql } from "@apollo/client";
import ContactRole from "../users/steps/step-contact-role";
import multiStep from "../../multiStep/multiStep";

const ROLE_CHANGE = gql`
  mutation roleChange($from: ID!, $name: String, $label: String) {
    roleChange(from: $from, name: $name, label: $label)
  }
`;

export default function ChangeRoleDialog({
  isOpen,
  handleClose,
  unitId,
  label,
  refetch,
}) {
  const [errors, setErrors] = React.useState({});

  const validate = (values) => {
    let nameError = "";
    if (!values.name) {
      nameError = "Required";
    }
    if (nameError) {
      setErrors({
        nameError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    multiStep.saveData({
      name: "role",
      value: { from: unitId },
    });
    multiStep.saveData({
      name: "role",
      value: { label: label },
    });
    const formData = multiStep.getData()["role"];
    const isValid = validate(formData);
    if (isValid) {
      roleChange({
        variables: formData,
      });
      multiStep.clear();
      handleClose();
    }
  };

  const [
    roleChange,
    { loading: acMutationLoading, error: acMutationError },
  ] = useMutation(ROLE_CHANGE, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="edit-role">
        <DialogTitle id="edit-role">Contact's Role Data</DialogTitle>
        <DialogContent>
          <ContactRole />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
