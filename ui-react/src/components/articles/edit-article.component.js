import React, { useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import EditorJs from "react-editor-js";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

import { Divider } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { EDITOR_JS_TOOLS } from "./tools";
import multiStep from "../../multiStep/multiStep";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_ARTICLE = gql`
  query articleQuery($id: ID) {
    getArticleById(id: $id) {
      id
      headline
      author
      excerpt
      blocks
    }
  }
`;

const UPDATE_ARTICLE = gql`
  mutation updateArticle($field: String, $value: String, $articleId: String) {
    updateArticle(field: $field, value: $value, articleId: $articleId) {
      id
    }
  }
`;

const GET_USERS = gql`
  query User {
    User {
      id
      first_name
      last_name
    }
  }
`;

function ArticleEdit(props) {
  const params = props.match.params;
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});

  const { loading, data, error, refetch } = useQuery(GET_ARTICLE, {
    variables: {
      id: params["uid"],
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== data.getArticleById[0][field]) {
      updateArticle({
        variables: {
          field: "article." + field,
          value: fieldValue,
          articleId: params["uid"],
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setIsEditMode({});
    setEngaged(false);
  };

  const [
    updateArticle,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_ARTICLE, {
    update: () => refetch(),
  });

  const instanceRef = useRef(null);

  async function handleSave() {
    const savedData = await instanceRef.current.save();
    multiStep.saveData({
      data: { ...multiStep.getData(), blocks: savedData.blocks },
    });
  }

  return (
    <>
      {loading && !error && <p>Loading Article for Edit...</p>}
      {error && !loading && <p>{error.message}</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={2}
          style={{
            border: "3px solid blue",
            margin: "12px",
            width: "98%",
          }}
        >
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Meta Data
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getArticleById.map(({ id, headline, author, excerpt }) => (
                <Card key={`card-${id}`}>
                  <CardContent>
                    <Avatar>***</Avatar>
                    <Typography gutterBottom variant="h5" component="h2">
                      {headline ? headline : "no data"}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="div"
                    >
                      {isEditMode["headline"] ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            label="Headline"
                            onClick={handleChange}
                            onChange={handleChange}
                            id="headline"
                            defaultValue={headline}
                            size="small"
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ name: true });
                              setEngaged(true);
                            } else setIsEditMode({ name: false });
                          }}
                        >
                          Headline: {headline}
                        </span>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="div"
                    >
                      {isEditMode["author"] ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            label="Author"
                            onClick={handleChange}
                            onChange={handleChange}
                            id="author"
                            defaultValue={author}
                            size="small"
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ name: true });
                              setEngaged(true);
                            } else setIsEditMode({ name: false });
                          }}
                        >
                          Author: {author}
                        </span>
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="div"
                    >
                      {isEditMode["excerpt"] ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            label="Excerpt"
                            onClick={handleChange}
                            onChange={handleChange}
                            id="excerpt"
                            defaultValue={excerpt}
                            size="small"
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ name: true });
                              setEngaged(true);
                            } else setIsEditMode({ name: false });
                          }}
                        >
                          Excerpt: {excerpt}
                        </span>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Content
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getArticleById.map(({ blocks }) => (
                <EditorJs
                  key="edunique"
                  data={JSON.parse(
                    JSON.stringify({ blocks: JSON.parse(blocks) })
                  )}
                  tools={EDITOR_JS_TOOLS}
                  onChange={handleSave}
                  instanceRef={(instance) => (instanceRef.current = instance)}
                />
              ))}
            </Grid>
          </Grid>
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Recommended
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {/*{data.getArticleById.map(({ id, assigned }) => (*/}
              {/*<Card key={`card-${id}`}>*/}
              {/*<CardContent>*/}
              {/*<Typography*/}
              {/*variant="body2"*/}
              {/*color="textSecondary"*/}
              {/*component="p"*/}
              {/*>*/}
              {/*<span>*/}
              {/*{assigned !== null*/}
              {/*? assigned.first_name + " " + assigned.last_name*/}
              {/*: "no assigned"}*/}
              {/*</span>*/}
              {/*</Typography>*/}
              {/*</CardContent>*/}
              {/*</Card>*/}
              {/*))}*/}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default withStyles(styles)(ArticleEdit);
