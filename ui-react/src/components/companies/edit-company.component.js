import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import GridNameComponent from "./grids/grids-name-component";
import GridCompanyComponent from "./grids/grids-company-component";

import { CardHeader, Divider } from "@material-ui/core";
import gql from "graphql-tag";

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
        created_at {
            formatted
        }
        domain_name
        owner_assigned_date
        address {
            id
            postal_code
            street_address1
            street_address2
        }
        phone_numbers
        parent
        website_url
        contacts {
            id
            first_name
            last_name
        }
        properties {
            id
            name
        }
        listings {
            id
            name
        }
        fb_fans {
            id
            first_name
        }
        team {
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
        owner {
            first_name
            last_name
        }
        owner_assigned_at
        pageviews_num
        phone
        sessions_num
        time_zone
        mailed(filter: { action: true }) {
            timestamp {
                formatted
            }
            Mail {
                id
                msgs
            }
        }
    }
}`;

const CompanyEdit=(props)=> {
    const { classes } = props;
    const params = props.match.params;
    const [
        openAddressDialogComponent,
        setOpenAddressDialogComponent
    ] = React.useState(false);
    const handleCloseAddressDialogComponent = () => {
        setOpenAddressDialogComponent(false);
    };
    const callAddressDialog = () => {
        setOpenAddressDialogComponent(true);
    };


  const { loading, data, error, refetch } = useQuery(GET_COMPANY, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={3}
          style={{
            border: "3px solid blue",
            margin: "12px",
            width: "98%"
          }}
        >
          <Grid item md={3}>
            <GridNameComponent
              title={"About"}
            >
            </GridNameComponent>
            <GridCompanyComponent
              companies={data.Company}
              refetch={refetch}
              companyId={params["uid"]}
            >
            </GridCompanyComponent>
          </Grid>
          <Grid item md={6}>
            <GridNameComponent
              title={"Activity"}
            >
            </GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              {data.Company.map(({ mailed }) =>
                mailed.map(({ Mail, timestamp }) => (
                  <Card key={`ard${Mail.id}`}>
                    <CardHeader
                      title={"Mailed "}
                      subheader={timestamp.formatted}
                    />

                    <Divider />

                    <CardContent key={"cd" + Mail.id}>
                      <Typography key={"tpip" + Mail.id}>
                        {JSON.parse(Mail.msgs).map(({ from, date, text }) => (
                          <div>
                            <p>from:{from}</p>
                            <p>date:{date}</p>
                            <p>text:{text}</p>
                            <Divider />
                          </div>
                        ))}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small" color="primary" variant="text">
                        Reply
                        <EmojiPeopleIcon className={classes.EmojiPeople} />
                      </Button>
                    </CardActions>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
          <Grid item md={3}>
              <GridNameComponent
                  title={"Associations"}
              >
              </GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              <Card key={`card`}>
                <CardHeader title="Contact" />
                <Divider />
                {data.Company.map(({ contacts }) =>
                  contacts.map(({ id, first_name, last_name }) => (

                    <CardContent key={`cd_${id}`}>
                      <Typography key={`tp_${id}`}>
                        <Link
                          key={`link${id}`}
                          className="edit-link"
                          to={`/contacts/${id}`}
                        >
                          {first_name} {last_name}
                        </Link>
                      </Typography>
                    </CardContent>
                  ))
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}

    </>
  );
};

export default withStyles(styles)(CompanyEdit);
