import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import multiStep from "../../../multiStep/multiStep";
const styles = theme => ({
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
    boxSizing: "border-box"
  }
});

function ContactData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const handleChange = event => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };
  const {
    first_name,
    last_name,
    email,
    phone,
    mobile,
    email_domain
  } = multiStep.getData();

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="First Name"
            onChange={handleChange}
            name="first_name"
            size="small"
            defaultValue={first_name}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors["first_name"] ? errors["first_name"] : ""}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Last Name"
            onChange={handleChange}
            name="last_name"
            size="small"
            defaultValue={last_name}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Email"
            onChange={handleChange}
            name="email"
            size="small"
            defaultValue={email}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Email domain"
            onChange={handleChange}
            name="email_domain"
            size="small"
            defaultValue={email_domain}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Phone"
            onChange={handleChange}
            name="phone"
            size="small"
            defaultValue={phone}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Mobile"
            onChange={handleChange}
            name="mobile"
            size="small"
            defaultValue={mobile}
          />
        </div>
      </div>
      <Link variant="body2" color="primary" to="/contacts">
        <Button color="primary" type="button">
          Back
        </Button>
      </Link>
    </div>
  );
}
export default withStyles(styles)(ContactData);
