import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../multiStep/multiStep";
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

function ContactAddress() {
  const handleChange = event => {
    multiStep.saveData({
      name: "address",
      value: { [event.target.name]: event.target.value }
    });
  };

  const { address } = multiStep.getData();
  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Postal Code"
            onChange={handleChange}
            name="postal_code"
            size="small"
            defaultValue={
              address && address.postal_code ? address.postal_code : ""
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Street Address 1"
            onChange={handleChange}
            name="street_address1"
            size="small"
            defaultValue={
              address && address.street_address1 ? address.street_address1 : ""
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Street Address 2"
            onChange={handleChange}
            name="street_address2"
            size="small"
            defaultValue={
              address && address.street_address2 ? address.street_address2 : ""
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="lat"
            onChange={handleChange}
            name="lat"
            size="small"
            defaultValue={address && address.lat ? address.lat : ""}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="lng"
            onChange={handleChange}
            name="lng"
            size="small"
            defaultValue={address && address.lng ? address.lng : ""}
          />
        </div>
      </div>
    </div>
  );
}
export default withStyles(styles)(ContactAddress);
