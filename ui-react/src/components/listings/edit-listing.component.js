import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { withStyles } from "@material-ui/core/styles";
import {
  GET_LISTING,
  UPDATE_LISTING,
  UPDATE_DATA,
  GET_USERS,
} from "./queries/edit-queries";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Divider,
  Button,
  Typography,
  Paper,
} from "@material-ui/core";
import GridNameComponent from "./grids/grids-name-component";
import GridListingComponent from "./grids/grids-listing-component";
import AddListingPropertyDialog from "../dialogs/add-listing-property-dialog";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

function ListingEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const [
    openDialogPropertyComponent,
    setOpenPropertyDialogComponent,
  ] = React.useState(false);

  const { loading, data, error, refetch } = useQuery(GET_LISTING, {
    variables: {
      id: params["uid"],
    },
  });

  const callPropertyDialog = () => {
    setOpenPropertyDialogComponent(true);
  };

  const handleClosePropertyDialogComponent = () => {
    setOpenPropertyDialogComponent(false);
  };

  const myListing = data ? data.getListingById : false;

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError,
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  const [
    updateContact,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_LISTING, {
    update: () => refetch(),
  });

  const [
    updateData,
    { loading: undMutationLoading, error: undQMutationError },
  ] = useMutation(UPDATE_DATA, {
    update: () => refetch(),
  });

  return (
    <Paper className={classes.root}>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {myListing && !loading && !error && (
        <>
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
              <GridNameComponent title={"Listing's Data"}></GridNameComponent>
              <GridListingComponent
                listings={myListing}
                refetch={refetch}
                listingId={params["uid"]}
                gridNum={1}
              ></GridListingComponent>
            </Grid>
            <Grid item md={6}>
              <GridNameComponent title={"Additional Data"}></GridNameComponent>
              <GridListingComponent
                listings={myListing}
                refetch={refetch}
                listingId={params["uid"]}
                gridNum={2}
              ></GridListingComponent>
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
                {myListing.map(({ properties }) => (
                  <Card key={"properties-card"}>
                    <CardActions>
                      <CardHeader title="Properties" />
                      <Button
                        onClick={callPropertyDialog}
                        size="small"
                        color="primary"
                      >
                        Add
                      </Button>
                    </CardActions>

                    <Divider />
                    {properties.map((property) => (
                      <CardContent key={"ls_" + property.id}>
                        <Typography key={"tp_" + property.id}>
                          <Link
                            key={"link_" + property.id}
                            className="edit-link"
                            to={"/properties/" + property.id}
                          >
                            {property.name}
                          </Link>
                        </Typography>
                      </CardContent>
                    ))}
                    <Divider />
                  </Card>
                ))}

                {myListing.map(({ users }) => (
                  <Card key={"users-card"}>
                    <CardActions>
                      <CardHeader title="Primary Agent" />
                      <Button
                        onClick={callPropertyDialog}
                        size="small"
                        color="primary"
                      >
                        Add
                      </Button>
                    </CardActions>
                    <Divider />
                    {users.map((user) => (
                      <CardContent key={"ls_" + user.id}>
                        <Typography key={"tp_" + user.id}>
                          <Link
                            key={"link_" + user.id}
                            className="edit-link"
                            to={"/users/" + user.id}
                          >
                            {user.first_name} {user.last_name}
                          </Link>
                        </Typography>
                      </CardContent>
                    ))}
                  </Card>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <AddListingPropertyDialog
            key={"AddProperty"}
            isOpen={openDialogPropertyComponent}
            handleClose={handleClosePropertyDialogComponent}
            listingId={params["uid"]}
            title="Property"
            refetch={refetch}
          ></AddListingPropertyDialog>
        </>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ListingEdit);
