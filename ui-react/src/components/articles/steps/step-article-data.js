import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
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

function ArticleData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };
  const { headline, author, excerpt } = multiStep.getData();

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Headline"
            onChange={handleChange}
            name="headline"
            size="small"
            defaultValue={headline}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors["headline"] ? errors["headline"] : ""}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Author"
            onChange={handleChange}
            name="author"
            size="small"
            defaultValue={author}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Excerpt"
            onChange={handleChange}
            name="excerpt"
            size="small"
            defaultValue={excerpt}
          />
        </div>
      </div>
      <Link variant="body2" color="primary" to="/articles">
        <Button color="primary" type="button">
          Back to Articles
        </Button>
      </Link>
    </div>
  );
}
export default withStyles(styles)(ArticleData);
