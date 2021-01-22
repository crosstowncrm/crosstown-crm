import React, { useRef } from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../tools";
import multiStep from "../../../multiStep/multiStep";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { gql, useMutation } from "@apollo/client/index";

const defaultData = {
  blocks: [
    {
      type: "header",
      data: {
        text: "headline",
        level: 2,
        config: {
          placeholder: "Enter a headline",
          defaultLevel: 3,
        },
      },
    },
    {
      type: "delimiter",
      data: {},
    },
  ],
};

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

const CREATE_NEW_ARTICLE = gql`
  mutation createArticle($arg: ArticleInput) {
    createArticle(arg: $arg) {
      id
    }
  }
`;

function ArticleContent() {
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

  const [
    createNewArticle,
    { loading: cnaMutationLoading, error: cnaQMutationError },
  ] = useMutation(CREATE_NEW_ARTICLE);

  const [errors, setErrors] = React.useState(multiStep.getErrors());

  const instanceRef = useRef(null);

  async function handleSave() {
    const savedData = await instanceRef.current.save();
    multiStep.saveData({
      data: { ...multiStep.getData(), blocks: savedData.blocks },
    });
  }

  const data =
    multiStep.getData().blocks &&
    Object.keys(multiStep.getData().blocks).length > 0
      ? { blocks: multiStep.getData() }
      : defaultData;

  return (
    <div>
      <div className="container">
        <EditorJs
          data={data}
          tools={EDITOR_JS_TOOLS}
          onChange={handleSave}
          instanceRef={(instance) => (instanceRef.current = instance)}
        />
      </div>
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
    </div>
  );
}

export default ArticleContent;
