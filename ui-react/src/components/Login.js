import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";

import { useLazyQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";

import ResponsiveCard from "../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../responsive/ResponsiveContainerGrid.js";

import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import auth from "../auth/auth.js";

const LOGIN_USER = gql`
  query loginUser($name: String, $pswd: String) {
    loginUser(name: $name, pswd: $pswd) {
      userId
      token
    }
  }
`;
const styles = (theme) => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto",
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
});

function Login() {

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
      auth.setToken(data[0].token);
      const path = "/users/" + data[0].userId;
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
        variables: { name: e.target.login.value, pswd: e.target.pswd.value },
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
                subheader="to continue with Crosstown"
              />
              <CardContent>
                <TextField
                  label="Enter login"
                  fullWidth
                  autoFocus
                  required
                  name="login"
                  id="login"
                />
                <TextField
                  label="Enter password"
                  fullWidth
                  required
                  type="password"
                  name="pswd"
                  id="pswd"
                />
              </CardContent>
              <CardActions style={{ justifyContent: "space-between" }}>
                <Button>Forgot password</Button>
                <Button type="submit" color="primary">
                  Sign in here
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
