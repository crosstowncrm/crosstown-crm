import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import TextField from '@material-ui/core/TextField';


import { CardHeader, Divider } from "@material-ui/core";
import {useMutation} from "@apollo/react-hooks/lib/index";

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
      created_at {
        formatted
      }
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
      address {
        id
        street_address1
      }
      properties {
        id
        Property {
          id
          name
        }
      }
      listings {
        id
        name
      }
      companies {
        id
        name
      }
      owner {
        id
        first_name
      }
      viewed(filter: { action: true }) {
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



const UPDATE_CONTACT = gql`
    mutation updateContact(
        $field: String,
        $value: String,
        $contactId: String
    ) {
        updateContact(
            field: $field,
            value: $value,
            contactId: $contactId
        ) {
            id
        }
    }
`;

function ContactEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const [editLNMode, setEditLNMode] = React.useState(false);
  const [editMailMode, setEditMailMode] = React.useState(false);
  const [editFNMode, setEditFNMode] = React.useState(false);
  const [PhoneMode, setEditPhoneMode] = React.useState(false);
  const [editMobileMode, setEditMobileMode] = React.useState(false);
  const [editLSMode, setEditLSMode] = React.useState(false);
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

  const setAllFalse = () => {
        setField(false);
        setFieldValue(false);
        setEditLNMode(false);
        setEditPhoneMode(false);
        setEditMobileMode(false);
        setEditMailMode(false);
        setEditFNMode(false);
        setEditLSMode(false);
        setEngaged(false);
   };

  const { loading, data, error } = useQuery(GET_CONTACT, {
    variables: {
      id: params["uid"]
    }
  });


  const handleSubmit = (event) => {
      event.preventDefault();
      if(!!field && fieldValue!==data.Contact[0][field]) {
          updateContact({
              variables: {
                  field: "contact." + field,
                  value: fieldValue,
                  contactId: params["uid"]
              }
          });
      }
      setAllFalse();
  };



  const handleChange = (event) => {
      event.preventDefault();
      setField(event.target.id);
      setFieldValue(event.target.value);
  };

  const handleCancel = (event) => {
        event.preventDefault();
        setAllFalse();
  };

  const [
        updateContact,
        { loading: cndMutationLoading, error: cndQMutationError }
  ] = useMutation(UPDATE_CONTACT, {
        update: (proxy, { data: { updateContact } }) => {

            data.Contact[0][field]=fieldValue;
            proxy.writeQuery({
                query: GET_CONTACT,
                data: { data: data }
            });
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
              {data.Contact.map(
                ({
                  first_name,
                  id,
                  last_name,
                  description,
                  email,
                  viewed,
                  phone,
                  mobile,
                  birthday,
                  lead_status,
                  lead_type,
                  lead_date,
                  last_activity,
                  last_seen,
                  first_seen
                }) => (
                  <Card key="{card-$id}">
                    <CardContent>
                      <Avatar>***</Avatar>
                      <Typography gutterBottom variant="h5" component="h2">
                        {first_name ? first_name : "no data"}{" "}
                        {last_name ? last_name : "no data"}
                      </Typography>
                    </CardContent>
                    <CardActionArea>
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
                    </CardActionArea>
                    <Divider />
                    <CardContent>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      > {editFNMode ?
                          <form
                              onSubmit={handleSubmit}
                          >
                              <TextField label="First Name" onClick={handleChange} onChange={handleChange} id="first_name" defaultValue={first_name} size="small" />
                              <button type="submit">Update</button>
                              <button onClick={handleCancel}>Cancel</button>
                          </form>
                          :
                            <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditFNMode(!editFNMode); setEngaged(true);} else setEditFNMode(editFNMode);}}>First name: {first_name}</span>
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                          {editLNMode ?
                              <form
                                  onSubmit={handleSubmit}
                              >
                                  <TextField label="Last Name" onChange={handleChange} id="last_name" defaultValue={last_name} size="small" />                              :
                                  <button type="submit">Update</button>
                                  <button onClick={handleCancel}>Cancel</button>
                              </form>
                              :
                              <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditLNMode(!editLNMode); setEngaged(true);} else setEditLNMode(editLNMode);}}>Last name: {last_name}</span>
                          }

                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                          {editMailMode ?
                              <form
                                  onSubmit={handleSubmit}
                              >
                                  <TextField label="email" onChange={handleChange} id="email" defaultValue={email} size="small" />
                                  <button type="submit">Update</button>
                                  <button onClick={handleCancel}>Cancel</button>
                              </form>
                              :
                              <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditMailMode(!editMailMode); setEngaged(true);} else setEditMailMode(editMailMode);}}>Email: {email}</span>
                          }
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                          {PhoneMode ?
                              <form
                                  onSubmit={handleSubmit}
                              >
                                  <TextField label="phone" onChange={handleChange} id="phone" defaultValue={phone} size="small" />                              :
                                  <button type="submit">Update</button>
                                  <button onClick={handleCancel}>Cancel</button>
                              </form>
                              :
                              <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditPhoneMode(!PhoneMode); setEngaged(true);} else setEditPhoneMode(PhoneMode);}}>phone: {phone}</span>
                          }
                      </Typography>

                      <Typography
                          variant="body2"
                          color="textSecondary"
                          component="div"
                        >
                          {editMobileMode ?
                              <form
                                  onSubmit={handleSubmit}
                              >
                                  <TextField label="mobile" onChange={handleChange} id="mobile" defaultValue={mobile} size="small" />
                                  <button type="submit">Update</button>
                                  <button onClick={handleCancel}>Cancel</button>
                              </form>
                              :
                              <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditMobileMode(!editMobileMode); setEngaged(true);} else setEditMobileMode(editMobileMode);}}>mobile: {mobile}</span>
                          }

                      </Typography>

                      <Typography
                          variant="body2"
                          color="textSecondary"
                          component="div"
                      >
                          {editLSMode ?
                              <form
                                  onSubmit={handleSubmit}
                              >
                                  <TextField label="lead status" onChange={handleChange} id="lead_status" defaultValue={lead_status} size="small" />
                                  <button type="submit">Update</button>
                                  <button onClick={handleCancel}>Cancel</button>
                              </form>
                              :
                              <span onDoubleClick={event=>{event.preventDefault(); if(!engaged){setEditLSMode(!editLSMode); setEngaged(true);} else setEditLSMode(editLSMode);}}>lead status: {lead_status}</span>
                          }

                      </Typography>


                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>lead_type:</span>
                          <span>{lead_type}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>lead_date:</span>
                          <span>{lead_date}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>last_activity:</span>
                          <span>{last_activity}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>last_seen:</span>
                          <span>{last_seen}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>first_seen:</span>
                          <span>{first_seen}</span>
                        </Typography>
                    </CardContent>
                  </Card>
                )
              )}
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
              {data.Contact.map(({ viewed }) =>
                viewed.map(article => (
                  <Card key={"card" + article.Article.id}>
                    <CardHeader
                      title={"Article read "}
                      subheader={article.timestamp.formatted}
                    />

                    <Divider />

                    <CardContent key={"cd" + article.Article.id}>
                      <Typography key={"tp" + article.Article.id}>
                        <Link
                          key={"link" + article.Article.id}
                          className="edit-link"
                          to={"/articles/" + article.Article.id}
                        >
                          {article.Article.title}
                        </Link>
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small" color="primary" variant="text">
                        Session Details
                        <ArrowForwardIcon
                          className={classes.arrowForwardIcon}
                        />
                      </Button>
                    </CardActions>
                  </Card>
                ))
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
              {data.Contact.map(({ companies }) =>
                companies.map(company => (
                  <Card key={"card" + company.id}>
                    <CardHeader title="Company" />
                    <Divider />
                    <CardContent key={"cc_" + company.id}>
                      <Typography key={"tp_" + company.id}>
                        <Link
                          key={"link_" + company.id}
                          className="edit-link"
                          to={"/companies/" + company.id}
                        >
                          {company.name}
                        </Link>
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default withStyles(styles)(ContactEdit);
