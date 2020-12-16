import React from "react";
import { makeStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import multiStep from "../../../multiStep/multiStep";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// const editor = new EditorJS({
//     holderId: 'editorjs',
//     tools: {
//         header: Header,
//         list: List,
//         data: {
//             time: 1556098174501,
//             blocks: [
//                 {
//                     type: "header",
//                     data: {
//                         text: "Editor.js",
//                         level: 2
//                     }
//                 },
//
//             ]
//         }
//     },});

// console.log(editor);

const useStyles = makeStyles((theme) => ({
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
  textField: {
    width: 400,
  },
  selectField: {
    width: 200,
  },
  row: {
    paddingTop: "10px",
  },
}));

function ArticleData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const classes = useStyles();
  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const { name } = multiStep.getData();

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            className={classes.textField}
            label="Name *"
            onChange={handleChange}
            name="name"
            defaultValue={name}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors["name"] ? errors["name"] : ""}
          </div>
        </div>
      </div>
      <div class="container">
        {/*<div id="editorjs">*/}
        {/*</div>*/}
      </div>
      <Link variant="body2" color="primary" to="/articles">
        <Button color="primary" type="button">
          Back to Articles
        </Button>
      </Link>
    </div>
  );
}
export default ArticleData;
