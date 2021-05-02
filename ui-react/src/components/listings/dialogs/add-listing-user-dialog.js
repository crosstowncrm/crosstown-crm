import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from "@material-ui/core/";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { USER_ADD } from "../queries/edit-queries";
import { GET_USERS } from "../queries/common-queries";
import { useMutation, useQuery } from "@apollo/client";

export default function AddListingUserDialog({
  isOpen,
  handleClose,
  listingId,
  refetch,
}) {
  const [formData, updateFormData] = React.useState({ to: listingId });
  const [errors, setErrors] = React.useState({});

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError,
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  const handleChange = (e, value) => {
    updateFormData((prevFormData) => {
      return {
        ...prevFormData,
        ["from"]: value.id,
      };
    });
  };

  const validate = (values) => {
    let userError = "";
    if (!values.to) {
      userError = "Required";
    }
    if (userError) {
      setErrors({
        userError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate(formData);

    if (isValid) {
      listingToUserAdd({
        variables: formData,
      });
      updateFormData({ from: listingId });
      handleClose();
    }
  };

  const [listingToUserAdd, { loading, error }] = useMutation(USER_ADD, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-listing-user"
      >
        <DialogTitle id="edit-listing-user">Users</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose the Listing's User</DialogContentText>
          {users && !usersQueryLoading && !usersQueryError && (
            <FormControl>
              <Autocomplete
                id="listing-user"
                name="listing-user"
                options={users.user}
                getOptionLabel={(option) =>
                  option.first_name + " " + option.last_name
                }
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.userError}
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
