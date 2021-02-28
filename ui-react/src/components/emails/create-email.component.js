import React from "react";
import MultiStep from "react-multistep";
import EmailData from "./steps/step-email-data";
import EmailDetails from "./steps/step-email-details";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Email Data", component: <EmailData /> },
  { name: "Email Details", component: <EmailDetails /> },
  { name: "Submit", component: <StepSubmit /> },
];

function EmailCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={10} sm={8}>
          <ResponsiveCard>
            <h1>Create Email multi step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default EmailCreate;
