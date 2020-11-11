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

const GET_ROLES = gql`
  query rolesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_RoleOrdering]
    $filter: String
  ) {
    role(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
    }
  }
`;

const GET_ROLES_COUNT = gql`
  query conatctsCountQuery {
    getRoleCount
  }
`;

function StepSubmit() {
  multiStep.validateRole();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_ROLE = gql`
    mutation createRole($name: String) {
      createRole(name: $name) {
        id
      }
    }
  `;

  const [
    createNewRole,
    { loading: cntMutationLoading, error: cntQMutationError },
  ] = useMutation(CREATE_NEW_ROLE, {});

  const createRole = (event) => {
    if (multiStep.validateRole() === true) {
      createNewRole({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_ROLES,
            variables: {
              first: 10,
              offset: 0,
              orderBy: `name_asc`,
              filter: "*",
            },
          },
          {
            query: GET_ROLES_COUNT,
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
        <Link variant="body2" color="primary" to="/roles" onClick={createRole}>
          <Button color="primary" type="button">
            Create
          </Button>
        </Link>
      )}
    </div>
  );
}
export default withStyles(styles)(StepSubmit);
