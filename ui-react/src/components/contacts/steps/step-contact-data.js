import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../../multiStep/multiStep";
const styles = theme => ({
  root: {
    maxWidth: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  input: {
    maxWidth: 100
  },
  inputCell: {
    maxWidth: "100%"
  }
});

function ContactData() {
  const handleChange = event => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value
    });
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
    </div>
  );
}
export default withStyles(styles)(ContactData);
