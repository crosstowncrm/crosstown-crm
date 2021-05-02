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
import { PROPERTY_ADD } from "../queries/edit-queries.js";
import { GET_PROPERTIES } from "../queries/common-queries.js";
import { useMutation, useQuery } from "@apollo/client";

export default function AddListingPropertyDialog({
  isOpen,
  handleClose,
  listingId,
  refetch,
}) {
  const [formData, updateFormData] = React.useState({ from: listingId });
  const [errors, setErrors] = React.useState({});

  const {
    loading: propertiesQueryLoading,
    data: properties,
    error: propertiesQueryError,
  } = useQuery(GET_PROPERTIES, {
    variables: {
      orderBy: "name_asc",
    },
  });

  const handleChange = (e, value) => {
    updateFormData((prevFormData) => {
      return {
        ...prevFormData,
        ["to"]: value.id,
      };
    });
  };

  const validate = (values) => {
    let propertyError = "";
    if (!values.to) {
      propertyError = "Required";
    }
    if (propertyError) {
      setErrors({
        propertyError,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate(formData);

    if (isValid) {
      listingToPropertyAdd({
        variables: formData,
      });
      updateFormData({ from: listingId });
      handleClose();
    }
  };

  const [listingToPropertyAdd, { loading, error }] = useMutation(PROPERTY_ADD, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-listing-property"
      >
        <DialogTitle id="edit-listing-property">Properties</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose the Listing's Property</DialogContentText>
          {properties && !propertiesQueryLoading && !propertiesQueryError && (
            <FormControl>
              <Autocomplete
                id="listing-property"
                name="listing-property"
                options={properties.property}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Property"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.propertyError}
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
