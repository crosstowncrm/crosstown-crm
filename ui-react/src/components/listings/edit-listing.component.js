import React from "react";
import { useQuery, gql } from "@apollo/client";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_LISTING = gql`
  query userQuery($id: String) {
    getListingById(id: $id) {
      id
      name
      square_footage
      added
      units
      parking_spaces
      pro_forma_noi
      properties {
        id
        name
      }
      user {
        id
        last_name
      }
    }
  }
`;

function ListingEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error } = useQuery(GET_LISTING, {
    variables: {
      id: params["uid"],
    },
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
              <TableCell key="name">name</TableCell>
              <TableCell key="square_footage">square footage</TableCell>
              <TableCell key="added">added</TableCell>
              <TableCell key="units">units</TableCell>
              <TableCell key="parking_spaces">parking spaces</TableCell>
              <TableCell key="pro_forma_noi">pro forma noi</TableCell>
              <TableCell key="properties">properties</TableCell>
              <TableCell key="user">user</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.getListingById.map((n) => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{n.square_footage}</TableCell>
                  <TableCell>{n.added}</TableCell>
                  <TableCell>{n.units}</TableCell>
                  <TableCell>{n.parking_spaces}</TableCell>
                  <TableCell>{n.pro_forma_noi}</TableCell>
                  <TableCell>
                    {n.properties.map((property) => (
                      <p key={property.id}>
                        <Link
                          className="edit-link"
                          to={"/properties/" + property.id}
                        >
                          {property.name}
                        </Link>
                      </p>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Link className="edit-link" to={"/users/" + n.user.id}>
                      {n.user.last_name}
                    </Link>
                  </TableCell>
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
