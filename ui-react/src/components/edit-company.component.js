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

const GET_COMPANY = gql`
  query company($id: ID) {
    Company(id: $id) {
      id
      name
      created_at
      domain_name
      owner_assigned_date
      address{
          id
          street_address1
      }
      phone_numbers
      parent
      website_url
      contacts{
          id
          first_name
      }
      properties{
          id
          name
      }
      listings{
          id
          name
      }
      fb_fans{
          id
          first_name
      }
      team{
          id
          name
      }
      fb_page
      child_companies_num
      li_page
      lifecycle_stage
      last_contacted
      twitter_bio
#      web_technologies
      first_contact_create_date
      last_seen
      first_seen
      year_founded
      description
      annual_revenue
      industry
      is_public
      contacted_times
      employees_num
      first_contact_created_at
      last_activity
      last_modified
      li_bio
      owner
      owner_assigned_at
      pageviews_num
      phone
      sessions_num
      time_zone
    }
  }
`;

function CompanyEdit(props) {
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
              <TableCell key="created_at">Created Date</TableCell>
              <TableCell key="domain_name">Domain Name</TableCell>
              <TableCell key="last_modified">Last Modified</TableCell>
              <TableCell key="owner_assigned_date">Owner assigned Date</TableCell>
              <TableCell key="website_url">Website Url</TableCell>
              <TableCell key="address">address</TableCell>
              <TableCell key="phone_numbers">phone numbers</TableCell>
              <TableCell key="parent">parent</TableCell>
              <TableCell key="contacts">contacts</TableCell>
              <TableCell key="properties">properties</TableCell>
              <TableCell key="listings">listings</TableCell>
              <TableCell key="fb_fans">fb_fans</TableCell>
              <TableCell key="team">team</TableCell>
              <TableCell key="fb_page">fb page</TableCell>
              <TableCell key="child_companies_num">child companies num</TableCell>
              <TableCell key="li_page">li page</TableCell>
              <TableCell key="lifecycle_stage">lifecycle stage</TableCell>
              <TableCell key="twitter_bio">twitter bio</TableCell>
              {/*<TableCell key="web_technologies">web technologies</TableCell>*/}
              <TableCell key="first_contact_create_date">first contact create date</TableCell>
              <TableCell key="last_seen">last seen</TableCell>
              <TableCell key="first_seen">first seen</TableCell>
              <TableCell key="year_founded">year founded</TableCell>
              <TableCell key="description">description</TableCell>
              <TableCell key="annual_revenue">annual revenue</TableCell>
              <TableCell key="industry">industry</TableCell>
              <TableCell key="is_public">is public</TableCell>
              <TableCell key="contacted_times">contacted times</TableCell>
              <TableCell key="employees_num">employees num</TableCell>
              <TableCell key="first_contact_created_at">first contact created at</TableCell>
              <TableCell key="last_activity">last activity</TableCell>
              <TableCell key="last_contacted">last contacted</TableCell>
              <TableCell key="li_bio">li bio</TableCell>
              <TableCell key="owner">owner</TableCell>
              <TableCell key="owner_assigned_at">owner assigned at</TableCell>
              <TableCell key="pageviews_num">pageviews num</TableCell>
              <TableCell key="phone">phone</TableCell>
              <TableCell key="sessions_num">sessions num</TableCell>
              <TableCell key="time_zone">time zone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Company.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>{n.name ? n.name: "no data"}</TableCell>
                  <TableCell>{n.created_at ? n.created_at: "no data"}</TableCell>
                  <TableCell>{n.domain_name ? n.domain_name: "no data"}</TableCell>
                  <TableCell>{n.last_modified ? n.last_modified: "no data"}</TableCell>
                  <TableCell>{n.owner_assigned_date ? n.owner_assigned_date: "no data"}</TableCell>
                  <TableCell>{n.website_url ? n.website_url: "no data"}</TableCell>
                  <TableCell>{n.address ? n.address.street_address1: "no data"}</TableCell>
                  <TableCell>{n.phone_numbers ? n.phone_numbers: "no data"}</TableCell>
                  <TableCell>{n.parent ? n.parent: "no data"}</TableCell>
                  {/*<TableCell>{n.contacts ? n.contacts.first_name: "no data"}</TableCell>*/}
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
                  {/*<TableCell>{n.properties ? n.properties: "no data"}</TableCell>*/}
                    <TableCell>
                        <ul>
                            {n.properties.map(property => (
                                <p key={property.id}>
                                    <Link className="edit-link" to={"/properties/" + property.id}>
                                        {property.name}
                                    </Link>
                                </p>
                            ))}
                        </ul>
                    </TableCell>
                  <TableCell>{n.listings ? n.listings: "no data"}</TableCell>
                  <TableCell>{n.fb_fans ? n.fb_fans: "no data"}</TableCell>
                  <TableCell>{n.team ? n.team: "no data"}</TableCell>
                  <TableCell>{n.fb_page ? n.fb_page: "no data"}</TableCell>
                  <TableCell>{n.child_companies_num ? n.child_companies_num: "no data"}</TableCell>
                  <TableCell>{n.li_page ? n.li_page: "no data"}</TableCell>
                  <TableCell>{n.lifecycle_stage ? n.lifecycle_stage: "no data"}</TableCell>
                  <TableCell>{n.twitter_bio ? n.twitter_bio: "no data"}</TableCell>
                  {/*<TableCell>{n.web_technologies ? n.web_technologies: "no data"}</TableCell>*/}
                  <TableCell>{n.first_contact_create_date ? n.first_contact_create_date: "no data"}</TableCell>
                  <TableCell>{n.last_seen ? n.last_seen: "no data"}</TableCell>
                  <TableCell>{n.first_seen ? n.first_seen: "no data"}</TableCell>
                  <TableCell>{n.year_founded ? n.year_founded: "no data"}</TableCell>
                  <TableCell>{n.description ? n.description: "no data"}</TableCell>
                  <TableCell>{n.annual_revenue ? n.annual_revenue: "no data"}</TableCell>
                  <TableCell>{n.industry ? n.industry: "no data"}</TableCell>
                  <TableCell>{n.is_public ? n.is_public: "no data"}</TableCell>
                  <TableCell>{n.contacted_times ? n.contacted_times: "no data"}</TableCell>
                  <TableCell>{n.employees_num ? n.employees_num: "no data"}</TableCell>
                  <TableCell>{n.first_contact_created_at ? n.first_contact_created_at: "no data"}</TableCell>
                  <TableCell>{n.last_activity ? n.last_activity: "no data"}</TableCell>
                  <TableCell>{n.last_contacted ? n.last_contacted: "no data"}</TableCell>
                  <TableCell>{n.li_bio ? n.li_bio: "no data"}</TableCell>
                  <TableCell>{n.owner ? n.owner: "no data"}</TableCell>
                  <TableCell>{n.owner_assigned_at ? n.owner_assigned_at: "no data"}</TableCell>
                  <TableCell>{n.pageviews_num ? n.pageviews_num: "no data"}</TableCell>
                  <TableCell>{n.phone ? n.phone: "no data"}</TableCell>
                  <TableCell>{n.sessions_num ? n.sessions_num: "no data"}</TableCell>
                  <TableCell>{n.time_zone ? n.time_zone: "no data"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(CompanyEdit);
