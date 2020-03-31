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
    Listing(id: $id) {
      id
      name
    }
  }
`;

function ListingEdit(props) {
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
              <TableCell key="name">Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Listing.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ListingEdit);
