import React from "react";

import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../../multiStep/multiStep";
const styles = theme => ({
  root: {
    maxWidth: "100%"
  }
});

function ContactAddress() {
  const [errors, setErrors] = React.useState(multiStep.getErrors()["address"]);
  const handleChange = event => {
    multiStep.saveData({
      name: "address",
      value: { [event.target.name]: event.target.value }
    });
    multiStep.errorRemove("address");
    setErrors({ ...errors, [event.target.name]: "" });
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
          <div style={{ fontSize: 12, color: "red" }}>
            {errors && errors.street_address1 ? errors.street_address1 : ""}
          </div>
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
