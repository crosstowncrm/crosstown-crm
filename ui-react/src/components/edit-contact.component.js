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

const GET_CONTACT = gql`
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
      suffix
      birthday
      contact_emails
      mobile
      phone_numbers
      linkedin_url
      facebook_url
      instagram_url
      twitter_url
      lead_type
      lead_date
      last_modified
      last_activity
      last_seen
      first_seen
      email_domain
      marital_status
      address{
          id
          street_address1
      }
      properties{
          id
          name
      }
      listings{
          id
          name
      }
#      teams
      companies{
          id
          name
      }
      owner{
          id
          first_name
      }
    }
  }
`;

function ContactEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const { loading, data, error } = useQuery(GET_CONTACT, {
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
              <TableCell key="suffix">suffix</TableCell>
              <TableCell key="birthday">birthday</TableCell>
              <TableCell key="contact_emails">contact emails</TableCell>
              <TableCell key="email">email</TableCell>
              <TableCell key="phone">phone</TableCell>
              <TableCell key="mobile">mobile</TableCell>
              <TableCell key="phone_numbers">phone numbers</TableCell>
              <TableCell key="linkedin_url">linkedin</TableCell>
              <TableCell key="facebook_url">facebook</TableCell>
              <TableCell key="instagram_url">instagram</TableCell>
              <TableCell key="twitter_url">twitter</TableCell>
              <TableCell key="lead_status">lead status</TableCell>
              <TableCell key="lead_type">lead type</TableCell>
              <TableCell key="lead_date">lead date</TableCell>
              <TableCell key="lifecycle_stage">lifecycle stage</TableCell>
              <TableCell key="created_at">created at</TableCell>
              <TableCell key="last_modified">last modified</TableCell>
              <TableCell key="last_activity">last activity</TableCell>
              <TableCell key="last_seen">last seen</TableCell>
              <TableCell key="first_seen">first seen</TableCell>
              <TableCell key="email_domain">email domain</TableCell>
              <TableCell key="marital_status">marital status</TableCell>
              <TableCell key="companies">companies</TableCell>
              <TableCell key="owner.first_name">owner name</TableCell>
              <TableCell key="address.street_address1">street address</TableCell>
              <TableCell key="properties">properties</TableCell>
              <TableCell key="listings">listings</TableCell>
                {/*teams*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Contact.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.first_name}</TableCell>
                  <TableCell>{n.last_name}</TableCell>
                  <TableCell>{n.suffix ? n.suffix: "no data"}</TableCell>
                  <TableCell>{n.birthday ? n.birthday: "no data"}</TableCell>
                  <TableCell>{n.contact_emails ? n.contact_emails: "no data"}</TableCell>
                  <TableCell>{n.email ? n.email: "no data"}</TableCell>
                  <TableCell>{n.phone ? n.phone: "no data"}</TableCell>
                  <TableCell>{n.mobile ? n.mobile: "no data"}</TableCell>
                  <TableCell>{n.phone_numbers ? n.phone_numbers: "no data"}</TableCell>
                  <TableCell>{n.linkedin_url ? n.linkedin_url: "no data"}</TableCell>
                  <TableCell>{n.facebook_url ? n.facebook_url: "no data"}</TableCell>
                  <TableCell>{n.instagram_url ? n.instagram_url: "no data"}</TableCell>
                  <TableCell>{n.twitter_url ? n.twitter_url: "no data"}</TableCell>
                  <TableCell>{n.lead_status? n.lead_status: "no data"}</TableCell>
                  <TableCell>{n.lead_type? n.lead_type: "no data"}</TableCell>
                  <TableCell>{n.lead_date? n.lead_date: "no data"}</TableCell>
                  <TableCell>{n.lifecycle_stage? n.lifecycle_stage: "no data"}</TableCell>
                  <TableCell>{n.created_at? n.created_at: "no data"}</TableCell>
                  <TableCell>{n.last_modified? n.last_modified: "no data"}</TableCell>
                  <TableCell>{n.last_activity? n.last_activity: "no data"}</TableCell>
                  <TableCell>{n.last_seen? n.last_seen: "no data"}</TableCell>
                  <TableCell>{n.first_seen? n.first_seen: "no data"}</TableCell>
                  <TableCell>{n.email_domain? n.email_domain: "no data"}</TableCell>
                  <TableCell>{n.marital_status? n.marital_status: "no data"}</TableCell>
                  <TableCell>
                      {n.companies.map(company => (
                          <Link className="edit-link" to={"/companies/" + company.id}>
                              {company.name}
                          </Link>
                      ))}
                  </TableCell>
                  <TableCell>
                    <Link className="edit-link" to={"/users/" + n.owner.id}>
                        {n.owner.first_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                      {/*<Link className="edit-link" to={"/address/" + n.address.id}>*/}
                          {n.address? n.address.street_address1: "no data"}
                      {/*</Link>*/}
                  </TableCell>
                  <TableCell>
                      {n.properties.map(property => (
                          <Link className="edit-link" to={"/properties/" + property.id}>
                              {property.name}
                          </Link>
                      ))}
                  </TableCell>
                  <TableCell>
                      {n.listings.map(listing => (
                          <Link className="edit-link" to={"/listings/" + listing.id}>
                              {listing.name}
                          </Link>
                      ))}
                  </TableCell>
                    {/*teams*/}
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
