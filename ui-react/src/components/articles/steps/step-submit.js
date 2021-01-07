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

const GET_ARTICLES = gql`
  query articlesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ArticleOrdering]
    $filter: String
  ) {
    article(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
    }
  }
`;

const GET_ARTICLES_COUNT = gql`
  query conatctsCountQuery {
    getArticleCount
  }
`;

function StepSubmit() {
  multiStep.validateArticle();
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const CREATE_NEW_ARTICLE = gql`
    mutation createArticle($arg: [ArticleInput]) {
      createArticle(arg: $arg) {
        id
      }
    }
  `;

  const [
    createNewArticle,
    { loading: cnaMutationLoading, error: cnaQMutationError },
  ] = useMutation(CREATE_NEW_ARTICLE);

  const createArticle = (event) => {
    if (multiStep.validateArticle() === true) {
      createNewArticle({
        variables: { arg: multiStep.getData() },
        refetchQueries: [
          {
            query: GET_ARTICLES,
            variables: {
              first: 10,
              offset: 0,
              orderBy: `id_asc`,
              filter: "*",
            },
          },
          {
            query: GET_ARTICLES_COUNT,
          },
        ],
      });
      multiStep.clear();
    } else {
      event.preventDefault();
      // setErrors(multiStep.getErrors());
    }
  };

  return (
    <div>
      <div className="row">
        <div className="ten columns terms">
          <span>Create contact with current data:</span>
          <ul className="docs-terms">
            {Object.entries(multiStep.getData()).map(([key, value]) => {
              return (
                <li
                  key={
                    key +
                    "-" +
                    value.type +
                    "-" +
                    value.data.level +
                    "-" +
                    value.data.text
                  }
                >
                  {key + "-" + value.type}: {value.data.text}
                </li>
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
          to="/articles"
          onClick={createArticle}
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
