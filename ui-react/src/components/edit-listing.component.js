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

const GET_LISTING = gql`
  query userQuery($id: ID) {
    Listing(id: $id) {
      id
      name
      square_footage
      added
      units
      parking_spaces
      pro_forma_noi
    }
  }
`;

function ListingEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error } = useQuery(GET_LISTING, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Listing Edit
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="name">Name</TableCell>
              <TableCell key="square_footage">square footage</TableCell>
              <TableCell key="added">added</TableCell>
              <TableCell key="units">units</TableCell>
              <TableCell key="parking_spaces">parking spaces</TableCell>
              <TableCell key="pro_forma_noi">pro forma noi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Listing.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                    <TableCell>{n.square_footage}</TableCell>
                    <TableCell>{n.added}</TableCell>
                    <TableCell>{n.units}</TableCell>
                    <TableCell>{n.parking_spaces}</TableCell>
                    <TableCell>{n.pro_forma_noi}</TableCell>
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
