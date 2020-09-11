import React from "react";
import MultiStep from "react-multistep";
import PropertyData from "./steps/step-property-data";
import SocialNetworks from "./steps/step-social-networks";
import PropertyDetails from "./steps/step-property-details";
import PropertyAddress from "./steps/step-property-address";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Property Data", component: <PropertyData /> },
  { name: "Social Networks", component: <SocialNetworks /> },
  { name: "Property Details", component: <PropertyDetails /> },
  { name: "Property Address", component: <PropertyAddress /> },
  { name: "Submit", component: <StepSubmit /> }
];

function PropertyCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={10} sm={8}>
          <ResponsiveCard>
            <h1>Create Property multi step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default PropertyCreate;
