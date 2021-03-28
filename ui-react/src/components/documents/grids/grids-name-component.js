import React from "react";
import { Grid } from "@material-ui/core";

export default function GridNameComponent({ title }) {
  return (
    <Grid
      item
      md={12}
      style={{
        border: "2px solid blue",
        margin: "2px",
      }}
    >
      {title}
    </Grid>
  );
}
