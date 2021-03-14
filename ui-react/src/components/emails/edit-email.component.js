import React from "react";
import { useQuery, gql } from "@apollo/client";
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
import GridEmailComponent from "./grids/grids-email-component";

import { CardHeader, Divider } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto",
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
});

const GET_EMAIL = gql`
  query getEmailById($id: String) {
    getEmailById(id: $id) {
      id
      subject
      content
      created {
        formatted
      }
      sent_by_user {
        User {
          id
          first_name
          last_name
        }
      }
      sent_to_contact {
        Contact {
          id
          first_name
          last_name
        }
      }
    }
  }
`;

const EmailEdit = (props) => {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error, refetch } = useQuery(GET_EMAIL, {
    variables: {
      id: params["uid"],
    },
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
            width: "98%",
          }}
        >
          <Grid item md={3}>
            <GridNameComponent title={"Email's Meta Data"}></GridNameComponent>
            <GridEmailComponent
              emails={data.getEmailById}
              refetch={refetch}
              emailId={params["uid"]}
            ></GridEmailComponent>
          </Grid>
          <Grid item md={6}>
            <GridNameComponent title={"Content"}></GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getEmailById.map(({ content }) => {
                return (
                  <Card key={`ard-1`}>
                    <CardHeader title={"Content "} />
                    <Divider />
                    <CardContent key={"cd-1"}>
                      <Typography key={"tpip-1"}>
                        <div>
                          {content}
                          <Divider />
                        </div>
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small" color="primary" variant="text">
                        Save
                        <EmojiPeopleIcon className={classes.EmojiPeople} />
                      </Button>
                    </CardActions>
                  </Card>
                );
              })}
            </Grid>
          </Grid>
          <Grid item md={3}>
            <GridNameComponent title={"Sent"}></GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              <Card key={`card-from`}>
                <CardHeader title="From" />
                <Divider />
                {data.getEmailById.map(({ sent_by_user }) => (
                  <CardContent key={`cd_${sent_by_user.User.id}`}>
                    <Typography key={`tp_${sent_by_user.User.id}`}>
                      <Link
                        key={`link${sent_by_user.User.id}`}
                        className="edit-link"
                        to={`/users/${sent_by_user.User.id}`}
                      >
                        {sent_by_user.User.first_name}{" "}
                        {sent_by_user.User.last_name}
                      </Link>
                    </Typography>
                  </CardContent>
                ))}
              </Card>

              <Card key={`card-to`}>
                <CardHeader title="To" />
                <Divider />
                {data.getEmailById.map(({ sent_to_contact }) => (
                  <CardContent key={`cd_${sent_to_contact.Contact.id}`}>
                    <Typography key={`tp_${sent_to_contact.Contact.id}`}>
                      <Link
                        key={`link${sent_to_contact.Contact.id}`}
                        className="edit-link"
                        to={`/contacts/${sent_to_contact.Contact.id}`}
                      >
                        {sent_to_contact.Contact.first_name}{" "}
                        {sent_to_contact.Contact.last_name}
                      </Link>
                    </Typography>
                  </CardContent>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default withStyles(styles)(EmailEdit);
