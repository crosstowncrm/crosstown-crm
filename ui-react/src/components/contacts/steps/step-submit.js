import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import { useMutation, gql } from "@apollo/client";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import multiStep from "../../../multiStep/multiStep";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_CONTACTS = gql`
  query contactsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    contact(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      first_name
      last_name
      email
      lead_status
      phone
      created_at {
        formatted
      }
      owner {
        first_name
        last_name
      }
    }
  }
`;
const GET_CONTACTS_COUNT = gql`
  query conatctsCountQuery {
    getContactCount
  }
`;
function StepSubmit(props) {
  multiStep.validate();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_CONTACT = gql`
    mutation createContact(
      $first_name: String
      $last_name: String
      $suffix: String
      $birthday: String
      $email: String
      $phone: String
      $mobile: String
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
      $address: Addressik
    ) {
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
        #        last_activity: $last_activity,
        #        $last_seen: String,
        #        $first_seen: String,
        email_domain: $email_domain
        marital_status: $marital_status
      ) {
        id
      }
    }
  `;

  const [
    createNewContact,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(CREATE_NEW_CONTACT, {});

  const createContact = (event) => {
    if (multiStep.isValid() === true) {
      createNewContact({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_CONTACTS,
            variables: {
              first: 10,
              offset: 0,
              orderByMe: `node.first_name asc`,
              filter: "*",
            },
          },
          {
            query: GET_CONTACTS_COUNT,
          },
        ],
      });
      multiStep.clear();
    } else {
      event.preventDefault();
      setErrors(multiStep.getErrors());
    }
  };

  return (
    <div>
      <div className="row">
        <div className="ten columns terms">
          <span>Create contact with current data:</span>
          <ul className="docs-terms">
            {Object.entries(multiStep.getData()).map(([key, value]) => {
              return typeof value === "string" ? (
                <li key={key + "-" + value}>
                  {key}: {value}
                </li>
              ) : (
                Object.entries(value).map(([valKey, valValue]) => {
                  return (
                    <li key={key + "-" + valKey + "-" + valValue}>
                      {key}: {valKey} {valValue}
                    </li>
                  );
                })
              );
            })}
          </ul>
        </div>
      </div>
      {Object.keys(errors).length > 0 ? (
        <div className="row">
          <div className="ten columns terms">
            <span>current errors:</span>
            <ul className="docs-terms">
              <li>{JSON.stringify(errors)}</li>
            </ul>
          </div>
        </div>
      ) : (
        <Link
          variant="body2"
          color="primary"
          to="/contacts"
          onClick={createContact}
        >
          <Button color="primary" type="button">
            Create
          </Button>
        </Link>
      )}
    </div>
  );
}
export default withStyles(styles)(StepSubmit);
