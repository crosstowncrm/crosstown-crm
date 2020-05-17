import React, {useState, useEffect} from "react";
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

const Login = () => {
  const [isAuth, setAuth] = useState(false);
  const [loginUser, { called, loading, data, error }] = useLazyQuery(LOGIN);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  let empty = null;
    useEffect(() => {
        if (data) {
            if( (data.loginUser.length > 0)){
                localStorage.setItem('userId', data.loginUser[0].id);//uid
                setAuth(true);

            }
            if( (data.loginUser.length === 0)){
                //redirect to login
                empty = true;
            }
        }
    });

    if (isAuth) {
          const path = '/users/' + localStorage.getItem('userId');
          return (<Redirect to={path} />)
    }

    if(empty){
        //redirect to error
        return (<Redirect to='/error' />)
    }

  // Wait for lazy query
  if (called && loading) return "Loading... ";
  // Show error message if lazy query fails
  if (error) return <p>{error.message}</p>;

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
                <span>
                    <Input
                        type="text"
                        name = "login"
                        id = "login"
                        placeholder="Your Login"
                        value = {login}
                        onChange={({ target }) => setLogin(target.value)}
                     />{' '}
                </span>
              Password
                <span>
                    <Input
                        type="text"
                        name = "pswd"
                        id = "pswd"
                        placeholder="Your Password"
                        value = {password}
                        onChange={({ target }) => setPassword(target.value)}
                    />{' '}
                </span>
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
