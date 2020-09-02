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
import TextField from "@material-ui/core/TextField";
import AddCompanyDialog from "../users/dialogs/add-company-dialog";
import ChangeAddressDialog from "../users/dialogs/change-address-dialog";
import AddInterestDialog from "../users/dialogs/add-interest-dialog";
import AddListingDialog from "../users/dialogs/add-listing-dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";

import { CardHeader, Divider } from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks/lib/index";

const styles = theme => ({
  root: {
    maxWidth: "100%"
  }
});

const GET_USER = gql`
  query userQuery($id: ID) {
    User(id: $id) {
      id
      first_name
      last_name
      email
      created_at {
        formatted
      }
      phone
      pswd
      address {
        id
        street_address1
        street_address2
        postal_code
      }
      owner {
        id
        first_name
        last_name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($field: String, $value: String, $UserId: String) {
    updateUser(field: $field, value: $value, UserId: $UserId) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation updateData($nodeLabel: String, $nodeId: String, $UserId: String) {
    updateData(nodeLabel: $nodeLabel, nodeId: $nodeId, UserId: $UserId)
  }
`;

const GET_USERS = gql`
  query user {
    user {
      id
      first_name
      last_name
    }
  }
`;

function UserEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const [editLNMode, setEditLNMode] = React.useState(false);
  const [editMailMode, setEditMailMode] = React.useState(false);
  const [editFNMode, setEditFNMode] = React.useState(false);
  const [PhoneMode, setEditPhoneMode] = React.useState(false);

  const [openDialogComponent, setOpenDialogComponent] = React.useState(false);
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent
  ] = React.useState(false);
  const [
    openDialogInterestComponent,
    setOpenInterestDialogComponent
  ] = React.useState(false);
  const [
    openDialogListingComponent,
    setOpenListingDialogComponent
  ] = React.useState(false);

  const callDialog = () => {
    setOpenDialogComponent(true);
  };

  const callAddressDialog = () => {
    setOpenAddressDialogComponent(true);
  };

  const callInterestDialog = () => {
    setOpenInterestDialogComponent(true);
  };

  const callListingDialog = () => {
    setOpenListingDialogComponent(true);
  };

  const handleCloseDialogComponent = () => {
    setOpenDialogComponent(false);
  };

  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };

  const handleCloseInterestDialogComponent = () => {
    setOpenInterestDialogComponent(false);
  };

  const handleCloseListingDialogComponent = () => {
    setOpenListingDialogComponent(false);
  };

  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

  const setAllFalse = () => {
    setField(false);
    setFieldValue(false);
    setEditLNMode(false);
    setEditPhoneMode(false);
    setEditMailMode(false);
    setEditFNMode(false);
    setEngaged(false);
  };

  const { loading, data, error, refetch } = useQuery(GET_USER, {
    variables: {
      id: params["uid"]
    }
  });

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc"
    }
  });

  const handleSubmit = event => {
    event.preventDefault();
    if (!!field && fieldValue !== data.User[0][field]) {
      updateUser({
        variables: {
          field: "User." + field,
          value: fieldValue,
          UserId: params["uid"]
        }
      });
    }
    setAllFalse();
  };

  const handleAcSubmit = event => {
    event.preventDefault();
    updateData({
      variables: {
        nodeLabel: event.target.name,
        nodeId: fieldValue,
        UserId: params["uid"]
      },
      update: refetch
    });
    setAllFalse();
  };

  const handleChange = event => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleAcChange = (event, value) => {
    event.preventDefault();
    setField("id");
    setFieldValue(value.id);
  };

  const handleCancel = event => {
    event.preventDefault();
    setAllFalse();
  };

  const [
    updateUser,
    { loading: cndMutationLoading, error: cndQMutationError }
  ] = useMutation(UPDATE_USER, {
    update: (proxy, { data: { updateUser } }) => {
      data.User[0][field] = fieldValue;
      proxy.writeQuery({
        query: GET_USER,
        data: { data: data }
      });
    }
  });

  const [
    updateData,
    { loading: undMutationLoading, error: undQMutationError }
  ] = useMutation(UPDATE_DATA, {});

  return (
    <>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={2}
          style={{
            border: "3px solid blue",
            margin: "12px",
            width: "98%"
          }}
        >
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              About
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              {data.User.map(
                ({
                  first_name,
                  id,
                  last_name,
                  email,
                  phone,
                  address,
                  owner
                }) => (
                  <Card key={`card-${id}`}>
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
                      >
                        {" "}
                        {editFNMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="First Name"
                              onClick={handleChange}
                              onChange={handleChange}
                              id="first_name"
                              defaultValue={first_name}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={event => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditFNMode(!editFNMode);
                                setEngaged(true);
                              } else setEditFNMode(editFNMode);
                            }}
                          >
                            First name: {first_name}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLNMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="Last Name"
                              onChange={handleChange}
                              id="last_name"
                              defaultValue={last_name}
                              size="small"
                            />{" "}
                            :
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={event => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLNMode(!editLNMode);
                                setEngaged(true);
                              } else setEditLNMode(editLNMode);
                            }}
                          >
                            Last name: {last_name}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editMailMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="email"
                              onChange={handleChange}
                              id="email"
                              defaultValue={email}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={event => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditMailMode(!editMailMode);
                                setEngaged(true);
                              } else setEditMailMode(editMailMode);
                            }}
                          >
                            Email: {email}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {PhoneMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="phone"
                              onChange={handleChange}
                              id="phone"
                              defaultValue={phone}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={event => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditPhoneMode(!PhoneMode);
                                setEngaged(true);
                              } else setEditPhoneMode(PhoneMode);
                            }}
                          >
                            phone: {phone}
                          </span>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Grid>
          </Grid>

          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              Contacts
            </Grid>

            {data.User.map(({ contacts }) => (
              <>
                <Grid
                  key={"listing"}
                  item
                  md={12}
                  style={{
                    border: "2px solid blue",
                    margin: "2px"
                  }}
                >
                  {/*<Card key={"contacts"}>*/}
                  {/*<CardActions>*/}
                  {/*<CardHeader title="Listings" />*/}
                  {/*<Button*/}
                  {/*onClick={callListingDialog}*/}
                  {/*size="small"*/}
                  {/*size="small"*/}
                  {/*color="primary"*/}
                  {/*>*/}
                  {/*Add*/}
                  {/*</Button>*/}
                  {/*</CardActions>*/}

                  {/*<Divider />*/}
                  {/*{listings.map(listing => (*/}
                  {/*<CardContent key={"ls_" + listing.id}>*/}
                  {/*<Typography key={"tp_" + listing.id}>*/}
                  {/*<Link*/}
                  {/*key={"link_" + listing.id}*/}
                  {/*className="edit-link"*/}
                  {/*to={"/listings/" + listing.id}*/}
                  {/*>*/}
                  {/*{listing.name}*/}
                  {/*</Link>*/}
                  {/*</Typography>*/}
                  {/*</CardContent>*/}
                  {/*))}*/}
                  {/*</Card>*/}
                </Grid>
                <ChangeAddressDialog
                  key={"changeAddress"}
                  isOpen={openAddressDialogComponent}
                  handleClose={handleCloseAddressDialogComponent}
                  UserId={params["uid"]}
                  title="Associations"
                  refetch={refetch}
                ></ChangeAddressDialog>
                <AddCompanyDialog
                  key={"addCompany"}
                  isOpen={openDialogComponent}
                  handleClose={handleCloseDialogComponent}
                  UserId={params["uid"]}
                  title="Associations"
                  refetch={refetch}
                ></AddCompanyDialog>
                <AddInterestDialog
                  key={"AddInterest"}
                  isOpen={openDialogInterestComponent}
                  handleClose={handleCloseInterestDialogComponent}
                  UserId={params["uid"]}
                  title="Interest"
                  refetch={refetch}
                ></AddInterestDialog>
                <AddListingDialog
                  key={"AddListing"}
                  isOpen={openDialogListingComponent}
                  handleClose={handleCloseListingDialogComponent}
                  UserId={params["uid"]}
                  title="Listing"
                  refetch={refetch}
                ></AddListingDialog>
              </>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default withStyles(styles)(UserEdit);
