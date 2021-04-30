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

import AddListingPropertyDialog from "../../dialogs/add-listing-property-dialog";

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
              <Button onClick={callPropertyDialog} size="small" color="primary">
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
      <AddListingPropertyDialog
        key={"AddProperty"}
        isOpen={openDialogPropertyComponent}
        handleClose={handleClosePropertyDialogComponent}
        listingId={listingId}
        title="Property"
        refetch={refetch}
      ></AddListingPropertyDialog>
    </>
  );
}
