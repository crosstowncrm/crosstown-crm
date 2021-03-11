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
      sent_by_user {
        id
        first_name
      }
      sent_to_contact {
        id
        first_name
      }
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
    mutation createEmail(
      $subject: String
      $content: String
      $forward: Boolean
      $reply: Boolean
      $from: String
      $contact: String
    ) {
      createEmail(
        subject: $subject
        content: $content
        forward: $forward
        reply: $reply
        from: $from
        contact: $contact
      ) {
        id
      }
    }
  `;

  const [
    createNewEmail,
    { loading: cneMutationLoading, error: cneMutationError },
  ] = useMutation(CREATE_NEW_EMAIL, {});

  const createEmail = (event) => {
    if (multiStep.validateEmail() === true) {
      createNewEmail({
        variables: {
          ...multiStep.getData(),
          from: localStorage.getItem("userId"),
        },
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
              return typeof value === "string" || typeof value === "boolean" ? (
                <li key={key + "-" + value.toString()}>
                  {key}: {value.toString()}
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
