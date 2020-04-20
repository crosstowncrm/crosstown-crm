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

const GET_COMPANY = gql`
  query company($id: ID) {
    Company(id: $id) {
      id
      name
      created_date
      domain_name
      last_modified
      owner_assigned_date
      parent_company
      website_url
    }
  }
`;

function UserEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error } = useQuery(GET_COMPANY, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Company Edit
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="name">Name</TableCell>
              <TableCell key="created_date">Created Date</TableCell>
              <TableCell key="domain_name">Domain Name</TableCell>
              <TableCell key="last_modified">Last Modified</TableCell>
              <TableCell key="owner_assigned_date">Owner assigned Date</TableCell>
              <TableCell key="parent_company">Parent Company</TableCell>
              <TableCell key="website_url">Website Url</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Company.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{n.created_date}</TableCell>
                  <TableCell>{n.domain_name}</TableCell>
                  <TableCell>{n.last_modified}</TableCell>
                  <TableCell>{n.owner_assigned_date}</TableCell>
                  <TableCell>{n.parent_company}</TableCell>
                  <TableCell>{n.website_url}</TableCell>
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
