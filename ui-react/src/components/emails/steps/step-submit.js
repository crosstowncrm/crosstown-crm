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

const GET_EMAILS = gql`
  query emailsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    email(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      subject
      content
    }
  }
`;
const GET_EMAILS_COUNT = gql`
  query emailsCountQuery {
    getEmailCount
  }
`;

function StepSubmit() {
  multiStep.validateEmail();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_EMAIL = gql`
    mutation createEmail($subject: String, $content: String) {
      createEmail(subject: $subject, content: $content) {
        id
      }
    }
  `;

  const [
    createNewEmail,
    { loading: cneMutationLoading, error: cneQMutationError },
  ] = useMutation(CREATE_NEW_EMAIL, {});

  const createEmail = (event) => {
    if (multiStep.validateEmail() === true) {
      createNewEmail({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_EMAILS,
            variables: {
              first: 10,
              offset: 0,
              orderByMe: `node.created asc`,
              filter: "*",
            },
          },
          {
            query: GET_EMAILS_COUNT,
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
          <span>Create email with current data:</span>
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
          to="/emails"
          onClick={createEmail}
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
