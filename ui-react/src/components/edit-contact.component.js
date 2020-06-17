import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
// import MoreButton from "../moreButton/moreButton.component";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import {
    CardHeader,
    Divider,
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
        viewed {
            timestamp {
                formatted
            }
            Article {
                id
                title
            }
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
      <>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (



          <Grid
          container
          spacing={3}
          style={{
          border: "3px solid blue",
          margin: "12px"
      }}
          >
              <Grid item md={3}>
                  <Grid
                      item
                      md={10}
                      style={{
                          border: "2px solid blue",
                          margin: "2px"
                      }}
                  >
                      About
                  </Grid>
                  <Grid
                      item
                      md={10}
                      style={{
                          border: "2px solid blue",
                          margin: "2px"
                      }}
                  >

                      {data.Contact.map(({first_name, last_name, description, email, viewed}) => (
                          <Card className={classes.root} key={"card" + viewed.id + "123"}>
                          <CardActionArea>
                          <CardMedia
                          className={classes.media}
                          image="/static/images/cards/contemplative-reptile.jpg"
                          title="Contemplative Reptile"
                          />
                          <CardContent>
                              <Avatar>***</Avatar>
                              <Typography gutterBottom variant="h5" component="h2">
                                  {first_name ? first_name : "no data"} {last_name ? last_name : "no data"}
                              </Typography>
                          </CardContent>
                          <CardActions>
                          <Link to="/" size="small" color="primary">
                          Note
                          </Link>
                          <Link to="/" size="small" color="primary">
                          Email
                          </Link>
                          <Link to="/" size="small" color="primary">
                          Call
                          </Link>
                          <Link to="/" size="small" color="primary">
                          Log
                          </Link>
                          <Link to="/" size="small" color="primary">
                          Task
                          </Link>
                          <Link to="/" size="small" color="primary">
                          Meet
                          </Link>
                          </CardActions>
                              <Divider />
                          <CardContent>

                              <Typography variant="body2" color="textSecondary" component="p">
                              About this Contact
                              </Typography>

                              <Typography variant="body2" color="textSecondary" component="p">
                              <span>Name:</span>
                              <span>{first_name}</span>
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p">
                              <span>Last name:</span>
                              <span>{last_name}</span>
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p">
                              <span>email:</span>
                              <span>{email}</span>
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p">
                              <span>contacted times:</span>
                              <span>{data.Contact[0].contacted_times}</span>
                              </Typography>
                          </CardContent>
                          </CardActionArea>

                          </Card>
                      ))}


                  </Grid>

              </Grid>
          <Grid item md={6}>
          <Grid
              item
              md={10}
              style={{
                  border: "2px solid blue",
                  margin: "2px"
              }}
          >
              Activity
          </Grid>
          <Grid
          item
          md={10}
          style={{
          border: "2px solid blue",
          margin: "2px"
      }}
          >
              {data.Contact.map(({viewed}) => (
                  viewed.map((article) => (
                  <Card key={"card"+article.Article.id}>
                      <CardHeader title="Article read" />
                      <Divider />
                      <CardContent key={"cd" + article.Article.id}>

                          <Typography key={"tp" + article.Article.id}>
                              <Link key={"link" + article.Article.id} className="edit-link" to={"/articles/" + article.Article.id}>
                                   {article.Article.title}
                              </Link>
                          </Typography>

                      </CardContent>
                      <CardActions className={classes.actions}>
                          <Button size="small" color="primary" variant="text">
                              Session Details
                              <ArrowForwardIcon className={classes.arrowForwardIcon} />
                          </Button>
                      </CardActions>
                  </Card>
                              )))
              )}
          </Grid>

          </Grid>

          <Grid item md={3}>
              <Grid
                  item
                  md={10}
                  style={{
                      border: "2px solid blue",
                      margin: "2px"
                  }}
              >
                  Associations
              </Grid>
          <Grid
          item
          md={10}
          style={{
          border: "2px solid blue",
          margin: "2px"
      }}
          >
              {data.Contact.map(({companies}) => (
                  companies.map((company) => (
                      <Card key={"card"+company.id}>
                          <CardHeader title="Company" />
                          <Divider />
                          <CardContent key={"cd" + company.id}>

                              <Typography key={"tp" + company.id}>
                                  <Link key={"link" + company.id} className="edit-link" to={"/companies/" + company.id}>
                                      {company.name}
                                  </Link>
                              </Typography>

                          </CardContent>
                      </Card>
                  )))
              )}


          </Grid>

          </Grid>
          </Grid>

      )}
      </>

  );
}

export default withStyles(styles)(ContactEdit);
