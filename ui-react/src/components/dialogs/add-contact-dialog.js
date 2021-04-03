import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useMutation, useQuery, gql } from "@apollo/client";

const GET_CONTACTS = gql`
  query contactsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ContactOrdering]
  ) {
    contact(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      first_name
      last_name
    }
  }
`;

const ASSOCIATION_ADD = gql`
  mutation associationAdd($from: String!, $to: String!) {
    associationAdd(from: $to, to: $from)
  }
`;

export default function AddContactDialog({
  isOpen,
  handleClose,
  contactId,
  refetch,
}) {
  const [formData, updateFormData] = React.useState({ from: contactId });
  const [errors, setErrors] = React.useState({});

  const {
    loading: contactsQueryLoading,
    data: contacts,
    error: contactsQueryError,
  } = useQuery(GET_CONTACTS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  const handleChange = (e, value) => {
    updateFormData({
      ...formData,
      ["to"]: value.id,
    });
  };

  const validate = (values) => {
    let contactError = "";
    if (!values.to) {
      contactError = "Required";
    }
    if (contactError) {
      setErrors({
        contactError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("wish you were here");
    const isValid = validate(formData);

    if (isValid) {
      associationAdd({
        variables: formData,
      });

      //clear form
      updateFormData({ from: contactId });
      handleClose();
    }
  };

  const [
    associationAdd,
    { loading: aaMutationLoading, error: aaMutationError },
  ] = useMutation(ASSOCIATION_ADD, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-apartment"
      >
        <DialogTitle id="edit-apartment">Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the Contact for Association
          </DialogContentText>
          {contacts && !contactsQueryLoading && !contactsQueryError && (
            <FormControl>
              <Autocomplete
                id="contact"
                name="contact"
                options={contacts.contact}
                getOptionLabel={(option) =>
                  option.first_name + " " + option.last_name
                }
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contact"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.clientError}
              </div>
            </FormControl>
          )}
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
