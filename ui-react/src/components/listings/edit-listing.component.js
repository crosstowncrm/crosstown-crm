import React from "react";
import { useQuery } from "@apollo/client";
import { withStyles } from "@material-ui/core/styles";
import { GET_LISTING } from "./queries/edit-queries";
import { Grid, Paper } from "@material-ui/core";
import GridNameComponent from "./grids/grids-name-component";
import GridListingComponent from "./grids/grids-listing-component";
import GridListingAssociationsComponent from "./grids/grids-listing-associations-component";

const styles = () => ({
  root: {
    maxWidth: "100%",
  },
});

function ListingEdit(props) {
  const { classes } = props;
  const params = props.match.params;

  const { loading, data, error, refetch } = useQuery(GET_LISTING, {
    variables: {
      id: params["uid"],
    },
  });

  const myListing = data ? data.getListingById : false;

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
              <GridListingAssociationsComponent
                listings={myListing}
                refetch={refetch}
                listingId={params["uid"]}
              ></GridListingAssociationsComponent>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ListingEdit);
