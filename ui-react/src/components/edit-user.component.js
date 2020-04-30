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

const GET_USER = gql`
  query userQuery($id: ID) {
    User(id: $id) {
      id
      first_name
      last_name
      email
      phone_number
      email_signature
      created_date
      address{
        id
        street_address1
      }
      follows{
        id
        first_name
      }
      teams{
        id
        name
      }
      contacts{
        id
        first_name
      }
      listings{
        id
        name
      }
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
              <TableCell key="created_date">created date</TableCell>
              <TableCell key="address">address</TableCell>
              <TableCell key="email_signature">follows</TableCell>
              <TableCell key="email_signature">teams</TableCell>
              <TableCell key="email_signature">contacts</TableCell>
              <TableCell key="email_signature">listings</TableCell>
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
                  <TableCell>{n.created_date}</TableCell>
                  <TableCell>{n.address? n.address.street_address1: "no data"}</TableCell>
                  <TableCell>
                    {n.follows.map(user => (
                        <p key={user.id}>
                          <Link className="edit-link" to={"/users/" + user.id}>
                              {user.first_name}
                          </Link>
                        </p>
                    ))}
                  </TableCell>
                  <TableCell>
                      {n.teams.map(team => (
                        <p key={team.id}>
                          <Link className="edit-link" to={"/teams/" + team.id}>
                              {team.name}
                          </Link>
                        </p>
                      ))}
                  </TableCell>
                  <TableCell>
                      {n.contacts.map(contact => (
                          <p key={contact.id}>
                            <Link className="edit-link" to={"/contacts/" + contact.id}>
                                {contact.first_name}
                            </Link>
                          </p>
                      ))}
                  </TableCell>
                  <TableCell>

                      {n.listings.map(listing => (
                          <p key={listing.id}>
                            <Link className="edit-link" to={"/listings/" + listing.id}>
                                {listing.name}
                            </Link>
                          </p>
                      ))}
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

export default withStyles(styles)(UserEdit);
