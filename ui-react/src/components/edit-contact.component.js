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
          <Grid item md={8}>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          >
              {data.Contact[0].viewed.map(viewed => (
                  <Link key={viewed.Article.id} className="edit-link" to={"/articles/" + viewed.Article.id}>
                      {viewed.Article.title} {viewed.timestamp.formatted}
                  </Link>
              ))}
          </Grid>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          >
          Activity
          </Grid>
          </Grid>
          <Grid item md={4}>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          ><Card className={classes.root}>
          <CardActionArea>
          <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
          />
          <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {data.Contact[0].first_name ? data.Contact[0].first_name: "no data"}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          {data.Contact[0].description}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          About this Contact
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              <p>Name:</p>
              <p>{data.Contact[0].first_name}</p>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              <p>Last name:</p>
              <p>{data.Contact[0].last_name}</p>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              <p>email:</p>
              <p>{data.Contact[0].email}</p>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              <p>contacted times:</p>
              <p>{data.Contact[0].contacted_times}</p>
          </Typography>
          </CardContent>
          </CardActionArea>
          <CardActions>
          <Button size="small" color="primary">
          Note
          </Button>
          <Button size="small" color="primary">
          Email
          </Button>
          <Button size="small" color="primary">
          Call
          </Button>
          <Button size="small" color="primary">
          Log
          </Button>
          <Button size="small" color="primary">
          Task
          </Button>
          <Button size="small" color="primary">
          Meet
          </Button>
          </CardActions>
          </Card>

          </Grid>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          >
              About
          </Grid>
          </Grid>
          <Grid item md={4}>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          ><ul>
              {data.Contact[0].companies.map(company => {
                  return(
                      <li>{company.name}</li>
                  )

              })}
          </ul>

          </Grid>
          <Grid
          item
          md={12}
          style={{
          border: "2px solid red",
          margin: "2px"
      }}
          >
              Associations
          </Grid>
          </Grid>
          </Grid>

      )}
      </>

  );
}

export default withStyles(styles)(ContactEdit);
