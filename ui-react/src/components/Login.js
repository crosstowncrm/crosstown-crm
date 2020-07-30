import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import {Redirect} from "react-router-dom";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import auth from '../auth/auth.js';

import {
  Paper,
  Input,
  Button,
} from "@material-ui/core";

const LOGIN_USER = gql`
    query loginUser($name: String, $pswd: String) {
        loginUser(name: $name, pswd: $pswd){
            id
        }
    }
`;
console.log();
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

function Login (props) {
  const { classes } = props;
  const [loginUser, lu] = useLazyQuery(LOGIN_USER);
  if (lu.loading ) {
    return "Loading...";
  }

  if (lu.data) {
      let data = false;
      if(lu.data){
          data = lu.data.loginUser;

      }
  if( (data.length > 0)){
        localStorage.setItem('userId', data[0].id);
        auth.login();
        console.log("auth = true");
        const path = '/' + data[0].__typename.toLowerCase() + 's/' + data[0].id;
        console.log(path);
        // window.location.href = path
        return (<Redirect to={path} />)
    }

    if( (data.length === 0)){
      return (<Redirect to='/error' />)
  }

  }

  async function handleSubmit(e) {
      e.preventDefault();
      try {
            await loginUser({variables: { name: e.target.login.value, pswd: e.target.pswd.value}})
      } catch (e) {
          console.error(e);
      }
  }

    return (
        <Paper className={classes.root}>
            <div className="Navigation-search">
                <form onSubmit={handleSubmit}>
                  Login
                    <Input
                        type="text"
                        name = "login"
                        id = "login"
                        placeholder="Your Login"
                    />{' '}
                    <br/>
                  Password
                    <Input
                        type="text"
                        name = "pswd"
                        id = "pswd"
                        placeholder="Your Password"
                    />{' '}
                    <br/>

                    <div className="flex mt3">

                    <Button type="submit">
                        Login
                    </Button>
                    </div>
                </form>
            </div>
        </Paper>
    );
}

export default withStyles(styles)(Login);
