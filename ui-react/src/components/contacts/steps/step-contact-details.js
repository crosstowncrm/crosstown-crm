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
function ContactDetails(props) {
  console.log(props);
  const handleChange = event => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value
    });
  };
  const {
    lead_status,
    lead_type,
    lead_date,
    lifecycle_stage,
    marital_status
  } = multiStep.getData();
  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Lead Status"
            onChange={handleChange}
            name="lead_status"
            size="small"
            defaultValue={lead_status}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Lead Type"
            onChange={handleChange}
            name="lead_type"
            size="small"
            defaultValue={lead_type}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Lead Date"
            onChange={handleChange}
            name="lead_date"
            size="small"
            defaultValue={lead_date}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Lifecycle Stage"
            onChange={handleChange}
            name="lifecycle_stage"
            size="small"
            defaultValue={lifecycle_stage}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Marital Status"
            onChange={handleChange}
            name="marital_status"
            size="small"
            defaultValue={marital_status}
          />
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(ContactDetails);
