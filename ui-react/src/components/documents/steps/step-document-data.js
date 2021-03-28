import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import multiStep from "../../../multiStep/multiStep";

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

function ContactData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const [file_name, setFileName] = React.useState("");
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return false;
    setErrors({});
    multiStep.saveCheckBox({
      name: event.target.name,
      value: file,
    });
    setFileName(file.name);
  };

  const { description } = multiStep.getData();

  return (
    <div>
      <div className="row">
        <div className="row">
          <div className="six columns">
            <TextField
              label="File"
              name="file_name"
              size="small"
              value={file_name}
              disabled={true}
            />
            <div style={{ fontSize: 12, color: "red" }}>
              {errors && errors.document ? errors.document : ""}
            </div>
          </div>
        </div>
        <div className="six columns">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="document"
            name="document"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="document">
            <Button variant="contained" component="span">
              Upload File
            </Button>
          </label>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Description"
            onChange={handleChange}
            name="description"
            size="small"
            defaultValue={description === "undefined" ? "" : description}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <FormControlLabel
            control={
              <Checkbox
                // checked={is_public}
                onClick={handleChangeCheckBox}
                name="is_public"
                color="primary"
              />
            }
            label="is public"
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
