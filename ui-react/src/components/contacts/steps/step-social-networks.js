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
function SocialNetworks(props) {
  const handleChange = event => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value
    });
  };
  const {
    linkedin_url,
    facebook_url,
    instagram_url,
    twitter_url
  } = multiStep.getData();
  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Linkedin Url"
            onChange={handleChange}
            name="linkedin_url"
            size="small"
            defaultValue={linkedin_url}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Facebook Url"
            onChange={handleChange}
            name="facebook_url"
            size="small"
            defaultValue={facebook_url}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Instagram Url"
            onChange={handleChange}
            name="instagram_url"
            size="small"
            defaultValue={instagram_url}
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <TextField
            label="Twitter Url"
            onChange={handleChange}
            name="twitter_url"
            size="small"
            defaultValue={twitter_url}
          />
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(SocialNetworks);
