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
import { useMutation, useQuery } from "@apollo/react-hooks/lib/index";
import gql from "graphql-tag";

const GET_PROPERTIES = gql`
  query propertiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_PropertyOrdering]
  ) {
    Property(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      name
    }
  }
`;

const INTEREST_ADD = gql`
  mutation interestAdd($from: String!, $to: String!) {
    mergeContactInterest(from: $from, to: $to) {
      id
    }
  }
`;

export default function AddInterestDialog({
  isOpen,
  handleClose,
  contactId,
  refetch,
  title,
}) {
  const [formData, updateFormData] = React.useState({ from: contactId });
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
    updateFormData({
      ...formData,
      ["to"]: value.id,
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
      console.log(formData);
      interestAdd({
        variables: formData,
      });
      updateFormData({ from: contactId });
      handleClose();
    }
  };

  const [
    interestAdd,
    { loading: iaMutationLoading, error: iaMutationError },
  ] = useMutation(INTEREST_ADD, {
    update: refetch,
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-apartment"
      >
        <DialogTitle id="edit-apartment">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>Choose the Company for {title}</DialogContentText>
          {properties && !propertiesQueryLoading && !propertiesQueryError && (
            <FormControl>
              <Autocomplete
                id="property"
                name="property"
                options={properties.Property}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Company"
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
