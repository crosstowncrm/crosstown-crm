import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import multiStep from "../../../multiStep/multiStep";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useQuery } from "@apollo/client/index";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    display: "inline-block",
    height: "38px",
    padding: "0 30px",
    color: "#555",
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 38,
    letterSpacing: "0.1rem",
    textTransform: "uppercase",
    textDecoration: "none",
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    borderRadius: "4px",
    border: "1px solid #bbb",
    cursor: "pointer",
    boxSizing: "border-box",
  },
});

const GET_CONTACTS = gql`
  query contactsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    contact(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      first_name
      last_name
    }
  }
`;

function EmailData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const [contactAC, setContactAC] = React.useState("");
  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const handleChangeCheckBox = (event) => {
    multiStep.saveCheckBox({
      name: event.target.name,
      value: event.target.checked,
    });
  };

  const handleAcChange = (event, value) => {
    const name = event.target.id.split("-")[0];
    multiStep.saveData({
      name: name,
      value: value.id,
    });
  };

  const { forward, reply, subject, content } = multiStep.getData();

  const {
    loading: contactsQueryLoading,
    data: contacts,
    error: contactsQueryError,
  } = useQuery(GET_CONTACTS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Subject"
            onChange={handleChange}
            name="subject"
            size="small"
            defaultValue={subject}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors && errors.subject ? errors.subject : ""}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Content"
            onChange={handleChange}
            name="content"
            size="small"
            defaultValue={content}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors && errors.content ? errors.content : ""}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <FormControlLabel
            control={
              <Checkbox
                checked={forward}
                onChange={handleChangeCheckBox}
                name="forward"
                color="primary"
              />
            }
            label="Forward"
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <FormControlLabel
            control={
              <Checkbox
                checked={reply}
                onChange={handleChangeCheckBox}
                name="reply"
                color="primary"
              />
            }
            label="Reply"
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          {contacts && !contactsQueryLoading && !contactsQueryError && (
            <>
              <Autocomplete
                id="contact"
                name="contact"
                options={contacts.contact}
                getOptionLabel={(option) =>
                  option.first_name + " " + option.last_name
                }
                style={{ width: 250 }}
                onChange={handleAcChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email to Contact"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>{errors.contact}</div>
            </>
          )}
        </div>
      </div>

      <Link variant="body2" color="primary" to="/emails">
        <Button color="primary" type="button">
          Back
        </Button>
      </Link>
    </div>
  );
}
export default withStyles(styles)(EmailData);
