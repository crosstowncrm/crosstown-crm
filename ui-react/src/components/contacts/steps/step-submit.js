import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import multiStep from "../../../multiStep/multiStep";
import { useMutation } from "@apollo/react-hooks/lib/index";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

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

function StepSubmit(props) {
  const CREATE_NEW_CONTACT = gql`
    mutation createContact(
      $first_name: String
      $last_name: String
      $suffix: String
      $birthday: String
      #        contact_emails: [String]
      $email: String
      $phone: String
      $mobile: String
      #        phone_numbers: [String]
      $linkedin_url: String
      $facebook_url: String
      $instagram_url: String
      $twitter_url: String
      $lead_status: String
      $lead_type: String
      $lead_date: String
      $lifecycle_stage: String
      $created_at: _Neo4jDateInput
      $last_modified: String
      #        $last_activity: String,
      #        $last_seen: String,
      #        $first_seen: String,
      $email_domain: String
      $marital_status: String
      $address: Addressik #        name: String
    ) #        owner:  User @relation(name: "OWNS_PROSPECT", direction: "IN")
    #        address:  Address @relation(name: "HAS_ADDRESS", direction: "OUT")
    #        companies:  [Company] @relation(name: "ASSOCIATED_WITH", direction: "OUT")
    #        properties:  [Interest]
    #        listings:  [Listing] @relation(name: "LISTS", direction: "OUT")
    {
      createContact(
        address: $address
        first_name: $first_name
        last_name: $last_name
        suffix: $suffix
        birthday: $birthday
        #        contact_emails: [String]
        email: $email
        phone: $phone
        mobile: $mobile
        #        phone_numbers: [String]
        linkedin_url: $linkedin_url
        facebook_url: $facebook_url
        instagram_url: $instagram_url
        twitter_url: $twitter_url
        lead_status: $lead_status
        lead_type: $lead_type
        lead_date: $lead_date
        lifecycle_stage: $lifecycle_stage
        created_at: $created_at
        last_modified: $last_modified
        #                last_activity: $last_activity,
        #        $last_seen: String,
        #        $first_seen: String,
        email_domain: $email_domain
        marital_status: $marital_status #        name: String
      ) #        owner:  User @relation(name: "OWNS_PROSPECT", direction: "IN")
      #        address:  Address @relation(name: "HAS_ADDRESS", direction: "OUT")
      #        companies:  [Company] @relation(name: "ASSOCIATED_WITH", direction: "OUT")
      #        properties:  [Interest]
      #        listings:  [Listing] @relation(name: "LISTS", direction: "OUT")
      {
        id
      }
    }
  `;

  const [
    createNewContact,
    { loading: cncMutationLoading, error: cncQMutationError }
  ] = useMutation(CREATE_NEW_CONTACT, {
    // update: (proxy, { data: { createDeal } }) => {
    //     const data = proxy.readQuery({
    //         query: GET_CONTACTS,
    //         variables: {
    //             offset: rowsPerPage * page,
    //             orderBy: orderBy + "_" + order,
    //             filter: getFilter()
    //         }
    //     });
    //
    //     data.Deal.push(createDeal);
    //     proxy.writeQuery({
    //         query: GET_DEALS,
    //         data: { data: data.Deal.concat(createDeal) }
    //     });
    // }
  });

  const validate = values => {
    // let clientError = "";
    // let actionError = "";
    // let propertyError = "";
    // let amountError = "";
    // let livingError = "";
    // let est_dateError = "";
    //
    // if (!values.client) {
    //     clientError = "Required";
    // }
    // if (!values.action) {
    //     actionError = "Required";
    // }
    // if (!values.property) {
    //     propertyError = "Required";
    // }
    // if (!values.amount) {
    //     amountError = "Required";
    // }
    // if (!values.living) {
    //     livingError = "Required";
    // }
    // if (!values.est_date) {
    //     est_dateError = "Required";
    // }
    // if (
    //     clientError ||
    //     actionError ||
    //     propertyError ||
    //     amountError ||
    //     livingError ||
    //     est_dateError
    // ) {
    //     setErrors({
    //         clientError,
    //         actionError,
    //         propertyError,
    //         amountError,
    //         livingError,
    //         est_dateError
    //     });
    //     return false;
    // }

    return true;
  };
  const createContact = () => {
    const multiData = multiStep.getData();
    const isValid = validate(multiData);
    if (isValid) {
      createNewContact({
        variables: multiData
      });
      // clear form
      multiStep.clear();
      //redirect to ContactList
    }
  };

  const [formData, updateFormData] = React.useState({
    checked: ""
  });

  const handleCheckedChanged = event => {
    updateFormData({ checked: event.target.checked });
  };

  return (
    <div>
      <div className="row">
        <div className="ten columns terms">
          <span>By clicking "Accept" I agree that:</span>
          <ul className="docs-terms">
            <li>
              I have read and accepted the <a href="#">User Agreement</a>
            </li>
          </ul>
          <label>
            <input
              type="checkbox"
              checked={formData.checked}
              onChange={handleCheckedChanged}
              autoFocus
            />
            <span> Accept </span>{" "}
          </label>
        </div>
      </div>
      <Link to="/contacts" onClick={createContact}>
        Create
      </Link>
    </div>
  );
}
export default withStyles(styles)(StepSubmit);
