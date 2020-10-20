import React from "react";
import { withStyles } from "@material-ui/core/styles/index";
import { useMutation } from "@apollo/react-hooks/lib/index";

import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import multiStep from "../../../multiStep/multiStep";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_COMPANIES = gql`
  query companiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    company(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      name
      employees_num
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
const GET_COMPANIES_COUNT = gql`
  query companiesCountQuery {
    getCompanyCount
  }
`;

function StepSubmit() {
  multiStep.validateComp();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_COMPANY = gql`
    mutation createCompany(
      $name: String
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
      $email_domain: String
      $address: Addressik
    ) {
      createCompany(
        address: $address
        name: $name
        email: $email
        phone: $phone
        mobile: $mobile
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
        email_domain: $email_domain
      ) {
        id
      }
    }
  `;

  const [
    createNewCompany,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(CREATE_NEW_COMPANY, {});

  const createCompany = (event) => {
    if (multiStep.validateComp() === true) {
      createNewCompany({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_COMPANIES,
            variables: {
              first: 10,
              offset: 0,
              orderByMe: `node.name asc`,
              filter: "*",
            },
          },
          {
            query: GET_COMPANIES_COUNT,
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
          <span>Create company with current data:</span>
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
          to="/companies"
          onClick={createCompany}
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
