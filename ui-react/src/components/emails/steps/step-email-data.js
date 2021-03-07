import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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

function EmailData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const [state, setState] = React.useState({
    forward: true,
    reply: true,
  });

  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const { forward, reply, subject, content } = multiStep.getData();

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
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <FormControlLabel
            control={
              <Checkbox
                checked={forward}
                onChange={handleChange}
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
                onChange={handleChange}
                name="reply"
                color="primary"
              />
            }
            label="Reply"
          />
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
