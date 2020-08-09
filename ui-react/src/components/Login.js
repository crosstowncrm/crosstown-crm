import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";

import { useLazyQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";

import ResponsiveCard from "./responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "./responsive/ResponsiveContainerGrid.js";

import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import auth from "../auth/auth.js";

const LOGIN_USER = gql`
  query loginUser($name: String, $pswd: String) {
    loginUser(name: $name, pswd: $pswd) {
      id
    }
  }
`;
const styles = theme => ({
  root: {
    maxWidth: 700,
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
  }
});

function Login(props) {
  const { classes } = props;
  const [loginUser, lu] = useLazyQuery(LOGIN_USER);
  if (lu.loading) {
    return "Loading...";
  }

  if (lu.data) {
    let data = false;
    if (lu.data) {
      data = lu.data.loginUser;
    }
    if (data.length > 0) {
      localStorage.setItem("userId", data[0].id);
      auth.login();
      const path = "/" + data[0].__typename.toLowerCase() + "s/" + data[0].id;
      return <Redirect to={path} />;
    }

    if (data.length === 0) {
      return <Redirect to="/error" />;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await loginUser({
        variables: { name: e.target.login.value, pswd: e.target.pswd.value }
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <ResponsiveContainerGrid>
        <Grid item xs={12} sm={6}>
          <ResponsiveCard>
            <form onSubmit={handleSubmit}>
              <CardHeader
                title="Sign in"
                subheader="to continue to Crosstown"
              />
              <CardContent>
                <TextField
                  label="Enter your login"
                  fullWidth
                  autoFocus
                  required
                  name="login"
                  id="login"
                  // inputRef={input => (this.emailInput = input)}
                  // error={this.state.email.error}
                  // helperText={this.state.email.helperText}
                />
                <TextField
                  label="Enter your password"
                  fullWidth
                  required
                  type="password"
                  name="pswd"
                  id="pswd"
                  // inputRef={input => (this.passwordInput = input)}
                />
              </CardContent>
              <CardActions style={{ justifyContent: "space-between" }}>
                <Button>Forgot password</Button>
                <Button type="submit" color="primary" raised>
                  Sign in
                </Button>
              </CardActions>
            </form>
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default withStyles(styles)(Login);
