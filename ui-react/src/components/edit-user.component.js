import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@material-ui/core";

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

const GET_USER = gql`
  query userQuery($id: ID) {
    User(id: $id) {
      id
      first_name
      last_name
      email
      phone_number
      email_signature
      #      avgStars
      #      numReviews
    }
  }
`;

function UserEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error } = useQuery(GET_USER, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        User Edit
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="first_name">first name</TableCell>
              <TableCell key="last_name">last name</TableCell>
              <TableCell key="email">email</TableCell>
              <TableCell key="phone_number">phone number</TableCell>
              <TableCell key="email_signature">email signature</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.User.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.first_name}</TableCell>
                  <TableCell>{n.last_name}</TableCell>
                  <TableCell>{n.email}</TableCell>
                  <TableCell>{n.phone_number}</TableCell>
                  <TableCell>{n.email_signature}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(UserEdit);
