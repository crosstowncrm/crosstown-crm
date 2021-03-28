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

const GET_DOCUMENTS = gql`
  query documentsPaginateQuery($orderByMe: String, $filter: String) {
    document(first: 10, offset: 0, orderByMe: $orderByMe, filter: $filter) {
      id
      name
      description
      is_public
      created {
        formatted
      }
      owner {
        first_name
        last_name
      }
    }
  }
`;

const GET_DOCUMENTS_COUNT = gql`
  query DocumentsCountQuery {
    getDocumentCount
  }
`;

function StepSubmit() {
  multiStep.validateDoc();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_DOCUMENT = gql`
    mutation createDocument(
      $description: String
      $is_public: Boolean
      $owner: String
      $document: Upload!
    ) {
      createDocument(
        description: $description
        is_public: $is_public
        owner: $owner
        document: $document
      ) {
        id
      }
    }
  `;

  const [
    createNewDocument,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(CREATE_NEW_DOCUMENT, {});

  const createDocument = (event) => {
    if (multiStep.validateDoc() === true) {
      createNewDocument({
        variables: {
          ...multiStep.getData(),
          owner: localStorage.getItem("userId"),
        },
        refetchQueries: [
          {
            query: GET_DOCUMENTS,
            variables: {
              first: 10,
              offset: 0,
              orderByMe: `node.name asc`,
              filter: "*",
            },
          },
          {
            query: GET_DOCUMENTS_COUNT,
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
          <span>Create document with current data:</span>
          <ul className="docs-terms">
            {Object.entries(multiStep.getData()).map(([key, value]) => {
              return typeof value === "string" || typeof value === "boolean" ? (
                <li key={key}>
                  {key}: {value.toString()}
                </li>
              ) : (
                <>
                  <li key="file-name">file name: {value.name}</li>

                  <li key="file-size">file size: {value.size}</li>

                  <li key="file-type">file type: {value.type}</li>
                </>
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
              <li key="error">{JSON.stringify(errors)}</li>
            </ul>
          </div>
        </div>
      ) : (
        <Link
          variant="body2"
          color="primary"
          to="/docs"
          onClick={createDocument}
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
