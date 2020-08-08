import React from "react";
import MultiStep from "react-multistep";
import ContactData from "./steps/step-contact-data";
import SocialNetworks from "./steps/step-social-networks";
import ContactDetails from "./steps/step-contact-details";
import ContactAddress from "./steps/step-contact-address";
import StepSubmit from "./steps/step-submit";

import { withStyles } from "@material-ui/core/styles/index";
const styles = theme => ({
  root: {
    maxWidth: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  input: {
    maxWidth: 100
  },
  inputCell: {
    maxWidth: "100%"
  }
});
const steps = [
  { name: "Contact Data", component: <ContactData /> },
  { name: "Social Networks", component: <SocialNetworks /> },
  { name: "Contact Details", component: <ContactDetails /> },
  { name: "Contact Address", component: <ContactAddress /> },
  { name: "Submit", component: <StepSubmit /> }
];

function ContactCreate() {
  return (
    <div className="App">
      <h1>Create Contact multi step</h1>
      <MultiStep steps={steps} />
    </div>
  );
}

export default withStyles(styles)(ContactCreate);
