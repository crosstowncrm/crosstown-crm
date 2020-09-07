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

const GET_COMPANIES = gql`
  query companiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_CompanyOrdering]
  ) {
    Company(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      name
    }
  }
`;

const ASSOCIATION_ADD = gql`
  mutation associationAdd($from: ID!, $to: ID!) {
    MergeContactCompanies(from: { id: $from }, to: { id: $to }) {
      from {
        id
      }
      to {
        id
      }
    }
  }
`;

export default function AddCompanyDialog({
  isOpen,
  handleClose,
  contactId,
  refetch
}) {
  const [formData, updateFormData] = React.useState({ from: contactId });
  const [errors, setErrors] = React.useState({});

  const {
    loading: companiesQueryLoading,
    data: companies,
    error: companiesQueryError
  } = useQuery(GET_COMPANIES, {
    variables: {
      orderBy: "name_asc"
    }
  });

  const handleChange = (e, value) => {
    console.log(value);
    updateFormData({
      ...formData,
      ["to"]: value.id
    });
  };

  const validate = values => {
    let companyError = "";
    if (!values.to) {
      companyError = "Required";
    }
    if (companyError) {
      setErrors({
        companyError
      });
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const isValid = validate(formData);

    if (isValid) {
      console.log(formData);
      associationAdd({
        variables: formData
      });

      //clear form
      updateFormData({ from: contactId });
      handleClose();
    }
  };

  const [
    associationAdd,
    { loading: aaMutationLoading, error: aaMutationError }
  ] = useMutation(ASSOCIATION_ADD, {
    update: refetch
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="edit-apartment"
      >
        <DialogTitle id="edit-apartment">Association</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the Company for Association
          </DialogContentText>
          {companies && !companiesQueryLoading && !companiesQueryError && (
            <FormControl>
              <Autocomplete
                id="company"
                name="company"
                options={companies.Company}
                getOptionLabel={option => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={params => (
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
