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
      name
      created_at {
        formatted
      }
      domain_name
      owner
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
            <GridNameComponent title={"About"}></GridNameComponent>
            <GridEmailComponent
              companies={data.getEmailById}
              refetch={refetch}
              emailId={params["uid"]}
            ></GridEmailComponent>
          </Grid>
          <Grid item md={6}>
            <GridNameComponent title={"Activity"}></GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getEmailById.map(({ mailed }) =>
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
            <GridNameComponent title={"Associations"}></GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              <Card key={`card`}>
                <CardHeader title="Contact" />
                <Divider />
                {data.getEmailById.map(({ contacts }) =>
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

export default withStyles(styles)(EmailEdit);
