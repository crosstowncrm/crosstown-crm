import React from "react";
import { useQuery, gql } from "@apollo/client";
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
import AddCompanyDialog from "../dialogs/add-company-dialog";
import ChangeAddressDialog from "../dialogs/change-address-dialog";
import AddInterestDialog from "../dialogs/add-interest-dialog";
import AddListingDialog from "../dialogs/add-listing-dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";

import { CardHeader, Divider } from "@material-ui/core";
import { useMutation } from "@apollo/client";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_CONTACT = gql`
  query getContactById($id: ID) {
    getContactById(id: $id) {
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
      last_activity
      last_seen
      first_seen
      email_domain
      marital_status
      address {
        id
        street_address1
        street_address2
        postal_code
      }
      properties {
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
        last_name
      }
      viewed {
        timestamp {
          formatted
        }
        Article {
          id
          headline
        }
      }
    }
  }
`;

const UPDATE_CONTACT = gql`
  mutation updateContact($field: String, $value: String, $contactId: String) {
    updateContact(field: $field, value: $value, contactId: $contactId) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $contactId: String
    $label: String
  ) {
    updateData(
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $contactId
      label: $label
    )
  }
`;

const GET_USERS = gql`
  query getUsers {
    user {
      id
      first_name
      last_name
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
  const [editLTMode, setEditLTMode] = React.useState(false);
  const [editLDMode, setEditLDMode] = React.useState(false);
  const [editLiMode, setEditLiMode] = React.useState(false);
  const [editLCSMode, setEditLCSMode] = React.useState(false);
  const [editFBMode, setEditFBMode] = React.useState(false);
  const [editInstMode, setEditInstMode] = React.useState(false);
  const [editTwitMode, setEditTwitMode] = React.useState(false);
  const [editBirthdayMode, setEditBirthdayMode] = React.useState(false);
  const [editMSMode, setEditMSMode] = React.useState(false);
  const [editOwnerMode, setEditOwnerMode] = React.useState(false);
  const [openDialogComponent, setOpenDialogComponent] = React.useState(false);
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);
  const [
    openDialogInterestComponent,
    setOpenInterestDialogComponent,
  ] = React.useState(false);
  const [
    openDialogListingComponent,
    setOpenListingDialogComponent,
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
    setEditMobileMode(false);
    setEditMailMode(false);
    setEditFNMode(false);
    setEditLSMode(false);
    setEditBirthdayMode(false);
    setEditLiMode(false);
    setEditLTMode(false);
    setEditLDMode(false);
    setEditFBMode(false);
    setEditInstMode(false);
    setEditTwitMode(false);
    setEditLCSMode(false);
    setEditMSMode(false);
    setEditOwnerMode(false);

    setEngaged(false);
  };

  const { loading, data, error, refetch } = useQuery(GET_CONTACT, {
    variables: {
      id: params["uid"],
    },
  });

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError,
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== data.getContactById[0][field]) {
      updateContact({
        variables: {
          field: "contact." + field,
          value: fieldValue,
          contactId: params["uid"],
        },
      });
    }
    setAllFalse();
  };

  const handleAcSubmit = (event) => {
    event.preventDefault();
    updateData({
      variables: {
        nodeLabel: event.target.name,
        nodeId: fieldValue,
        contactId: params["uid"],
        label: "Contact",
      },
      update: () => refetch(),
    });
    setAllFalse();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleAcChange = (event, value) => {
    event.preventDefault();
    setField("id");
    setFieldValue(value.id);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setAllFalse();
  };

  const [
    updateContact,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_CONTACT, {
    update: (proxy, { data: { updateContact } }) => {
      data.getContactById[0][field] = fieldValue;
      proxy.writeQuery({
        query: GET_CONTACT,
        data: { data: data },
      });
    },
  });

  const [
    updateData,
    { loading: undMutationLoading, error: undQMutationError },
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
            width: "98%",
          }}
        >
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              About
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getContactById.map(
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
                  first_seen,
                  linkedin_url,
                  facebook_url,
                  instagram_url,
                  twitter_url,
                  lifecycle_stage,
                  marital_status,
                  address,
                  owner,
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
                            onDoubleClick={(event) => {
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
                            onDoubleClick={(event) => {
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
                            onDoubleClick={(event) => {
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
                            onDoubleClick={(event) => {
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

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editMobileMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="mobile"
                              onChange={handleChange}
                              id="mobile"
                              defaultValue={mobile}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditMobileMode(!editMobileMode);
                                setEngaged(true);
                              } else setEditMobileMode(editMobileMode);
                            }}
                          >
                            mobile: {mobile}
                          </span>
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLSMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="lead status"
                              onChange={handleChange}
                              id="lead_status"
                              defaultValue={lead_status}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLSMode(!editLSMode);
                                setEngaged(true);
                              } else setEditLSMode(editLSMode);
                            }}
                          >
                            lead status: {lead_status}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editBirthdayMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              type="date"
                              label="birthday"
                              onChange={handleChange}
                              id="birthday"
                              defaultValue={birthday}
                              size="small"
                              style={{
                                width: 200,
                              }}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditBirthdayMode(!editBirthdayMode);
                                setEngaged(true);
                              } else setEditBirthdayMode(editBirthdayMode);
                            }}
                          >
                            birthday: {birthday}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLiMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="linkedin url"
                              onChange={handleChange}
                              id="linkedin_url"
                              defaultValue={birthday}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLiMode(!editLiMode);
                                setEngaged(true);
                              } else setEditLiMode(editLiMode);
                            }}
                          >
                            linkedin url: {linkedin_url}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editFBMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="facebook_url"
                              onChange={handleChange}
                              id="facebook_url"
                              defaultValue={facebook_url}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditFBMode(!editFBMode);
                                setEngaged(true);
                              } else setEditFBMode(editFBMode);
                            }}
                          >
                            facebook url: {facebook_url}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editInstMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="instagram_url"
                              onChange={handleChange}
                              id="instagram_url"
                              defaultValue={instagram_url}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditInstMode(!editInstMode);
                                setEngaged(true);
                              } else setEditInstMode(editInstMode);
                            }}
                          >
                            instagram url: {instagram_url}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editTwitMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="twitter_url"
                              onChange={handleChange}
                              id="twitter_url"
                              defaultValue={twitter_url}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditTwitMode(!editTwitMode);
                                setEngaged(true);
                              } else setEditTwitMode(editTwitMode);
                            }}
                          >
                            twitter url: {twitter_url}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLTMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="lead_type"
                              onChange={handleChange}
                              id="lead_type"
                              defaultValue={lead_type}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLTMode(!editLTMode);
                                setEngaged(true);
                              } else setEditLTMode(editLTMode);
                            }}
                          >
                            lead type: {lead_type}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLDMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              type="date"
                              label="lead_date"
                              onChange={handleChange}
                              id="lead_date"
                              defaultValue={lead_date}
                              size="small"
                              style={{
                                width: 200,
                              }}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLDMode(!editLDMode);
                                setEngaged(true);
                              } else setEditLDMode(editLDMode);
                            }}
                          >
                            lead date: {lead_date}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editLCSMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="lifecycle_stage"
                              onChange={handleChange}
                              id="lifecycle_stage"
                              defaultValue={lifecycle_stage}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditLCSMode(!editLCSMode);
                                setEngaged(true);
                              } else setEditLCSMode(editLCSMode);
                            }}
                          >
                            lifecycle stage: {lifecycle_stage}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editMSMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="marital_status"
                              onChange={handleChange}
                              id="marital_status"
                              defaultValue={marital_status}
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
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditMSMode(!editMSMode);
                                setEngaged(true);
                              } else setEditMSMode(editMSMode);
                            }}
                          >
                            marital status: {marital_status}
                          </span>
                        )}
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
                        component="div"
                      >
                        <span onDoubleClick={callAddressDialog}>
                          address:
                          {address !== null
                            ? " " +
                              address.postal_code +
                              " " +
                              address.street_address1 +
                              " " +
                              address.street_address2
                            : "no address yet"}
                        </span>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editOwnerMode ? (
                          <form name="User" onSubmit={handleAcSubmit}>
                            {users && !usersQueryLoading && !usersQueryError && (
                              <FormControl>
                                <Autocomplete
                                  id="user"
                                  name="user"
                                  options={users.user}
                                  getOptionLabel={(option) =>
                                    option.first_name + " " + option.last_name
                                  }
                                  style={{ width: 250 }}
                                  onChange={handleAcChange}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="User"
                                      variant="outlined"
                                      data-validators="isRequired"
                                      required={true}
                                    />
                                  )}
                                />
                                <div style={{ fontSize: 12, color: "red" }}>
                                  {/*{errors.clientError}*/}
                                </div>
                                <br />
                                <Button color="primary" type="submit">
                                  Update
                                </Button>
                                <Button
                                  color="secondary"
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </FormControl>
                            )}
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditOwnerMode(!editOwnerMode);
                                setEngaged(true);
                              } else setEditOwnerMode(editOwnerMode);
                            }}
                          >
                            owner:{" "}
                            {owner && owner.first_name
                              ? owner.first_name + " " + owner.last_name
                              : "no owner"}
                          </span>
                        )}
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
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Activity
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getContactById.map(({ viewed }, j) =>
                viewed.map((article, i) => (
                  <Card key={"card_" + j}>
                    <CardHeader
                      title={"Article read " + j}
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
                          {article.Article.headline}
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
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Associations, Interests, Listings
            </Grid>

            {data.getContactById.map(({ companies, properties, listings }) => (
              <>
                <Grid
                  key="company"
                  item
                  md={12}
                  style={{
                    border: "2px solid blue",
                    margin: "2px",
                  }}
                >
                  <Card key={"company"}>
                    <CardActions>
                      <CardHeader title="Company" />
                      <Button onClick={callDialog} size="small" color="primary">
                        Add
                      </Button>
                    </CardActions>
                    <Divider />
                    <CardContent key={"key"}>
                      {companies.map((company) => (
                        <Typography key={"tp_" + company.id}>
                          <Link
                            key={"link_" + company.id}
                            className="edit-link"
                            to={"/companies/" + company.id}
                          >
                            {company.name}
                          </Link>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  key={"property"}
                  item
                  md={12}
                  style={{
                    border: "2px solid blue",
                    margin: "2px",
                  }}
                >
                  <Card key={"property"}>
                    <CardActions>
                      <CardHeader title="Has Interest In" />
                      <Button
                        onClick={callInterestDialog}
                        size="small"
                        color="primary"
                      >
                        Add
                      </Button>
                    </CardActions>
                    <Divider />
                    <CardContent>
                      {properties.map((property) => (
                        <Typography key={"tp_" + property.Property.id}>
                          <Link
                            key={"link_" + property.Property.id}
                            className="edit-link"
                            to={"/properties/" + property.Property.id}
                          >
                            {property.Property.name}
                          </Link>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  key={"listing"}
                  item
                  md={12}
                  style={{
                    border: "2px solid blue",
                    margin: "2px",
                  }}
                >
                  <Card key={"listing"}>
                    <CardActions>
                      <CardHeader title="Listings" />
                      <Button
                        onClick={callListingDialog}
                        size="small"
                        size="small"
                        color="primary"
                      >
                        Add
                      </Button>
                    </CardActions>

                    <Divider />
                    {listings.map((listing) => (
                      <CardContent key={"ls_" + listing.id}>
                        <Typography key={"tp_" + listing.id}>
                          <Link
                            key={"link_" + listing.id}
                            className="edit-link"
                            to={"/listings/" + listing.id}
                          >
                            {listing.name}
                          </Link>
                        </Typography>
                      </CardContent>
                    ))}
                  </Card>
                </Grid>
              </>
            ))}
          </Grid>
        </Grid>
      )}
      <ChangeAddressDialog
        key={"changeAddress"}
        isOpen={openAddressDialogComponent}
        handleClose={handleCloseAddressDialogComponent}
        unitId={params["uid"]}
        title="Address"
        refetch={refetch}
        label="Contact"
      ></ChangeAddressDialog>
      <AddCompanyDialog
        key={"addCompany"}
        isOpen={openDialogComponent}
        handleClose={handleCloseDialogComponent}
        contactId={params["uid"]}
        title="Associations"
        refetch={refetch}
      ></AddCompanyDialog>
      <AddInterestDialog
        key={"AddInterest"}
        isOpen={openDialogInterestComponent}
        handleClose={handleCloseInterestDialogComponent}
        contactId={params["uid"]}
        title="Interest"
        refetch={refetch}
      ></AddInterestDialog>
      <AddListingDialog
        key={"AddListing"}
        isOpen={openDialogListingComponent}
        handleClose={handleCloseListingDialogComponent}
        contactId={params["uid"]}
        title="Listing"
        refetch={refetch}
      ></AddListingDialog>
    </>
  );
}

export default withStyles(styles)(ContactEdit);
