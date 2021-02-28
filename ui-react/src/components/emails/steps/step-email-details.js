import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../../multiStep/multiStep";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function ContactDetails() {
  const classes = useStyles();
  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
  };
  const { id, name } = multiStep.getData();
  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Lifecycle Stage"
            onChange={handleChange}
            name="lifecycle_stage"
            size="small"
            defaultValue={name}
          />
        </div>
      </div>
    </div>
  );
}
