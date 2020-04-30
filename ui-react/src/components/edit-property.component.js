import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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

const GET_PROPERTY = gql`
  query propertyQuery($id: ID) {
    Property(id: $id) {
      id
      name
      property_type
      secondary_type
      additional_types
      address{
        id
        street_address1
      }
      contacts{
        id
        first_name
      }
      companies{
        id
        name
      }
      listings{
        id
        name
      }
    }
  }
`;

function PropertyEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error } = useQuery(GET_PROPERTY, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Property Edit
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="name">name</TableCell>
              <TableCell key="property_type">property type</TableCell>
              <TableCell key="secondary_type">secondary type</TableCell>
              <TableCell key="additional_types">additional types</TableCell>
              <TableCell key="address">address</TableCell>
              <TableCell key="contacts">contacts</TableCell>
              <TableCell key="companies">companies</TableCell>
              <TableCell key="listings">listings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Property.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{n.property_type}</TableCell>
                  <TableCell>{n.secondary_type}</TableCell>
                  <TableCell>{n.additional_types}</TableCell>
                  <TableCell>{n.address ? n.address.street_address1: "no data"}</TableCell>
                  <TableCell>
                      <ul>
                          {n.contacts.map(contact => (
                              <p key={contact.id}>
                                  <Link className="edit-link" to={"/contacts/" + contact.id}>
                                      {contact.first_name}
                                  </Link>
                              </p>
                          ))}
                      </ul>
                  </TableCell>
                  <TableCell>
                      <ul>
                          {n.companies.map(company => (
                              <p key={company.id}>
                                  <Link className="edit-link" to={"/companies/" + company.id}>
                                      {company.name}
                                  </Link>
                              </p>
                          ))}
                      </ul>
                  </TableCell>
                  <TableCell>
                      <ul>
                          {n.listings.map(listing => (
                              <p key={listing.id}>
                                  <Link className="edit-link" to={"/listings/" + listing.id}>
                                      {listing.name}
                                  </Link>
                              </p>
                          ))}
                      </ul>
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

export default withStyles(styles)(PropertyEdit);
