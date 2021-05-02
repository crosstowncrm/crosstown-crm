import React from "react";
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
} from "@material-ui/core";

import AddListingPropertyDialog from "../dialogs/add-listing-property-dialog";
import AddListingUserDialog from "../dialogs/add-listing-user-dialog";

export default function GridListingComponent({ listings, refetch, listingId }) {
  const [
    openDialogPropertyComponent,
    setOpenPropertyDialogComponent,
  ] = React.useState(false);

  const callPropertyDialog = () => {
    setOpenPropertyDialogComponent(true);
  };

  const handleClosePropertyDialogComponent = () => {
    setOpenPropertyDialogComponent(false);
  };

  const [openDialogUserComponent, setOpenUserDialogComponent] = React.useState(
    false
  );

  const callUserDialog = () => {
    setOpenUserDialogComponent(true);
  };

  const handleCloseUserDialogComponent = () => {
    setOpenUserDialogComponent(false);
  };

  return (
    <>
      <Grid
        item
        md={12}
        style={{
          border: "2px solid blue",
          margin: "2px",
        }}
      >
        {listings.map(({ properties }) => (
          <Card key={"properties-card"}>
            <CardActions>
              <CardHeader title="Properties" />
              <Button onClick={callPropertyDialog} size="small" color="primary">
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

        {listings.map(({ users }) => (
          <Card key={"users-card"}>
            <CardActions>
              <CardHeader title="Primary Agent" />
              <Button onClick={callUserDialog} size="small" color="primary">
                Add
              </Button>
            </CardActions>
            <Divider />
            {users.map((user) => (
              <CardContent key={"ls_" + user.id}>
                <Typography>
                  <Link className="edit-link" to={"/users/" + user.id}>
                    {user.first_name} {user.last_name}
                  </Link>
                </Typography>
              </CardContent>
            ))}
          </Card>
        ))}
      </Grid>
      <AddListingPropertyDialog
        key={"AddProperty"}
        isOpen={openDialogPropertyComponent}
        handleClose={handleClosePropertyDialogComponent}
        listingId={listingId}
        title="Property"
        refetch={refetch}
      ></AddListingPropertyDialog>
      <AddListingUserDialog
        key={"AddUser"}
        isOpen={openDialogUserComponent}
        handleClose={handleCloseUserDialogComponent}
        listingId={listingId}
        title="User"
        refetch={refetch}
      ></AddListingUserDialog>
    </>
  );
}
