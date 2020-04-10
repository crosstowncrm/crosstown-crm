import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import {
    Redirect
} from "react-router-dom";import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";

import {
  Input,
  Button

} from "@material-ui/core";


const LOGIN = gql`
    query loginUser($name: String, $pswd: String) {
        loginUser(name: $name, pswd: $pswd){
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

function Login (props) {
  console.log(props);
  const [loginUser, { loading, data }] = useLazyQuery(LOGIN);
  if (loading) {
    return "Loading...";
  }
  if (data) {
      console.log('est data');
    if( (data.loginUser.length > 0)){
        console.log('est login');
        localStorage.setItem('userId', data.loginUser[0].id);
        const path = '/users/' + data.loginUser[0].id;
        window.location.href = path
        // return (<Redirect to={path} />)
    }
      if( (data.loginUser.length === 0)){
          console.log('redirect to login');
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
    );
}

export default withStyles(styles)(Login);
