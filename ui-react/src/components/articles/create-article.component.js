import React from "react";
import MultiStep from "react-multistep";
import ArticleData from "./steps/step-article-data";
import ArticleContent from "./steps/step-article-content";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Article's Data", component: <ArticleData /> },
  { name: "Article's Content", component: <ArticleContent /> },
];

function ArticleCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={12} sm={12}>
          <ResponsiveCard>
            <h1>Create Article step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default ArticleCreate;
