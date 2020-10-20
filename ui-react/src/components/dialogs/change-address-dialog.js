import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/react-hooks/lib/index";
import ContactAddress from "../contacts/steps/step-contact-address";
import multiStep from "../../multiStep/multiStep";
import gql from "graphql-tag";

const ADDRESS_CHANGE = gql`
  mutation addressChange(
    $from: ID!
    $postal_code: String
    $street_address1: String
    $street_address2: String
    $lat: String
    $lng: String
    $label: String
  ) {
    addressChange(
      from: $from
      postal_code: $postal_code
      street_address1: $street_address1
      street_address2: $street_address2
      lat: $lat
      lng: $lng
      label: $label
    )
  }
`;

export default function ChangeAddressDialog({
  isOpen,
  handleClose,
  unitId,
  label,
  refetch,
}) {
  const [errors, setErrors] = React.useState({});

  const validate = (values) => {
    let listingError = "";
    if (!values.street_address1) {
      listingError = "Required";
    }
    if (listingError) {
      setErrors({
        listingError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    multiStep.saveData({
      name: "address",
      value: { from: unitId },
    });
    multiStep.saveData({
      name: "address",
      value: { label: label },
    });
    const formData = multiStep.getData()["address"];
    const isValid = validate(formData);

    if (isValid) {
      addressChange({
        variables: formData,
      });

      multiStep.clear();
      handleClose();
    }
  };

  const [
    addressChange,
    { loading: acMutationLoading, error: acMutationError },
  ] = useMutation(ADDRESS_CHANGE, {
    update: refetch,
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-apartment"
      >
        <DialogTitle id="edit-apartment">Contact's Address Data</DialogTitle>
        <DialogContent>
          <ContactAddress />
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
