import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import { useMutation } from "@apollo/client";

import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import multiStep from "../../../multiStep/multiStep";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_USERS = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    user(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
        id
        first_name
        last_name
        email
        pswd
        phone
        created_at {
          formatted
        }
        owner {
          first_name
          last_name
        }
        role {
            id
            name
        }
      }
  }
`;

const GET_USERS_COUNT = gql`
  query usersCountQuery {
    getUserCount
  }
`;

function StepSubmit(props) {
  multiStep.validate();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_USER = gql`
    mutation createUser(
      $first_name: String
      $last_name: String
      $birthday: String
      $email: String
      $phone: String
      $mobile: String
      $pswd: String
      $lead_type: String
      $lead_date: String
      $lifecycle_stage: String
      $created_at: _Neo4jDateInput
      $last_modified: String
      $email_domain: String
      $marital_status: String
      $address: Addressik
    ) {
      createUser(
        address: $address
        first_name: $first_name
        last_name: $last_name
        birthday: $birthday
        email: $email
        phone: $phone
        mobile: $mobile
        pswd: $pswd
        lead_type: $lead_type
        lead_date: $lead_date
        lifecycle_stage: $lifecycle_stage
        created_at: $created_at
        last_modified: $last_modified
        email_domain: $email_domain
        marital_status: $marital_status
      ) {
        id
      }
    }
  `;

  const [
    createNewUser,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(CREATE_NEW_USER);

  const createUser = (event) => {
    if (multiStep.isValid() === true) {
      createNewUser({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_USERS,
            variables: {
              first: 10,
              offset: 0,
              orderByMe: `node.first_name asc`,
              filter: "*",
            },
          },
          {
            query: GET_USERS_COUNT,
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
          <span>Create user with current data:</span>
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
        <Link variant="body2" color="primary" to="/users" onClick={createUser}>
          <Button color="primary" type="button">
            Create
          </Button>
        </Link>
      )}
    </div>
  );
}
export default withStyles(styles)(StepSubmit);
