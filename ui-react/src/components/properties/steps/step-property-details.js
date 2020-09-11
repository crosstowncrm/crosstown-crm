import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../../multiStep/multiStep";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function ContactDetails() {
  const classes = useStyles();
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
    birthday
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
            type="date"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
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
    </div>
  );
}
