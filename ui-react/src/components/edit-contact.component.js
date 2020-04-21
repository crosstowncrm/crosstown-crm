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
    Contact(id: $id) {
      id
      first_name
      last_name
      email
      lead_status
      lifecycle_stage
      created_at
      phone
    }
  }
`;

function ContactEdit(props) {
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
        Contact Edit
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
              <TableCell key="phone">phone</TableCell>
              <TableCell key="lead_status">lead status</TableCell>
              <TableCell key="lifecycle_stage">lifecycle stage</TableCell>
              <TableCell key="created_at">created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Contact.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.first_name}</TableCell>
                  <TableCell>{n.last_name}</TableCell>
                  <TableCell>{n.email}</TableCell>
                  <TableCell>{n.phone}</TableCell>
                  <TableCell>{n.lead_status}</TableCell>
                  <TableCell>{n.lifecycle_stage}</TableCell>
                  <TableCell>{n.created_at}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ContactEdit);
