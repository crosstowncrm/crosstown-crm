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

const GET_TASKS = gql`
  query tasksPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_TaskOrdering]
    $filter: String
  ) {
    task(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      type
      priority
      title
      notes
      due_date {
        formatted
      }
      assigned {
        id
        first_name
        last_name
      }
      associated {
        id
        name
      }
      created_at {
        formatted
      }
    }
  }
`;

const GET_TASKS_COUNT = gql`
  query conatctsCountQuery {
    getTaskCount
  }
`;

function StepSubmit() {
  multiStep.validateTask();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_TASK = gql`
    mutation createTask(
      $type: String
      $priority: String
      $title: String
      $associated: String
      $label: String
      $assigned: String
      $notes: String
      $date: String
    ) {
      createTask(
        type: $type
        priority: $priority
        title: $title
        associated: $associated
        label: $label
        assigned: $assigned
        notes: $notes
        dueDate: $date
      ) {
        id
      }
    }
  `;

  const [
    createNewTask,
    { loading: cntMutationLoading, error: cntQMutationError },
  ] = useMutation(CREATE_NEW_TASK, {});

  const createTask = (event) => {
    if (multiStep.validateTask() === true) {
      createNewTask({
        variables: multiStep.getData(),
        refetchQueries: [
          {
            query: GET_TASKS,
            variables: {
              first: 10,
              offset: 0,
              orderBy: `due_date_asc`,
              filter: "*",
            },
          },
          {
            query: GET_TASKS_COUNT,
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
        <Link variant="body2" color="primary" to="/tasks" onClick={createTask}>
          <Button color="primary" type="button">
            Create
          </Button>
        </Link>
      )}
    </div>
  );
}
export default withStyles(styles)(StepSubmit);
