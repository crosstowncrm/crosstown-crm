import React from "react";
import MultiStep from "react-multistep";
import CompanyData from "./steps/step-company-data";
import SocialNetworks from "./steps/step-social-networks";
import CompanyDetails from "./steps/step-company-details";
import CompanyAddress from "./steps/step-company-address";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Company Data", component: <CompanyData /> },
  { name: "Social Networks", component: <SocialNetworks /> },
  { name: "Company Details", component: <CompanyDetails /> },
  { name: "Company Address", component: <CompanyAddress /> },
  { name: "Submit", component: <StepSubmit /> }
];

function CompanyCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={10} sm={8}>
          <ResponsiveCard>
            <h1>Create Company multi step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default CompanyCreate;
