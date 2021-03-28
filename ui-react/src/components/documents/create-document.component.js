import React from "react";
import MultiStep from "react-multistep";
import DocumentData from "./steps/step-document-data";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Document Data", component: <DocumentData key="dd" /> },
  { name: "Submit", component: <StepSubmit key="ss" /> },
];

function DocumentCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={10} sm={8}>
          <ResponsiveCard>
            <h1>Create Document multi step</h1>
            <MultiStep steps={steps} key="ms" />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default DocumentCreate;
