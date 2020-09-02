import React from "react";
import MultiStep from "react-multistep";
import ContactData from "./steps/step-contact-data";
import ContactDetails from "./steps/step-contact-details";
import ContactAddress from "./steps/step-contact-address";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "User Data", component: <ContactData /> },
  { name: "User Details", component: <ContactDetails /> },
  { name: "User Address", component: <ContactAddress /> },
  { name: "Submit", component: <StepSubmit /> }
];

function ContactCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={10} sm={8}>
          <ResponsiveCard>
            <h1>Create User multi step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default ContactCreate;
