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

const GET_LISTINGS = gql`
  query listingsForUsers(
    $first: Int
    $offset: Int
    $orderBy: [_ListingOrdering]
  ) {
    listings(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      name
    }
  }
`;

const LISTING_ADD = gql`
  mutation listingToCompanyAdd($from: String!, $to: String!) {
    listingToCompanyAdd(from: $from, to: $to)
  }
`;

export default function AddListingDialog({
  isOpen,
  handleClose,
  companyId,
  refetch,
}) {
  const [formData, updateFormData] = React.useState({ from: companyId });
  const [errors, setErrors] = React.useState({});

  const {
    loading: listingsQueryLoading,
    data: listings,
    error: listingsQueryError,
  } = useQuery(GET_LISTINGS, {
    variables: {
      orderBy: "name_asc",
    },
  });

  const handleChange = (e, value) => {
    updateFormData({
      ...formData,
      ["to"]: value.id,
    });
  };

  const validate = (values) => {
    let listingError = "";
    if (!values.to) {
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
    const isValid = validate(formData);

    if (isValid) {
      associationAdd({
        variables: formData,
      });
      updateFormData({ from: companyId });
      handleClose();
    }
  };

  const [associationAdd, { loading, error }] = useMutation(LISTING_ADD, {
    update: () => refetch(),
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-apartment"
      >
        <DialogTitle id="edit-apartment">Listings</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose the Company's Listing</DialogContentText>
          {listings && !listingsQueryLoading && !listingsQueryError && (
            <FormControl>
              <Autocomplete
                id="company"
                name="company"
                options={listings.listings}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Listing"
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
