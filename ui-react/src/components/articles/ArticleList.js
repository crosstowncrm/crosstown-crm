import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteArticleDialog from "../dialogs/delete-article-dialog";
import { useMutation, useQuery, gql } from "@apollo/client";
import TablePagination from "@material-ui/core/TablePagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  TextField,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto",
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  input: {
    maxWidth: 100,
  },
  inputCell: {
    maxWidth: "100%",
  },
  tableCell: {
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
      author
      excerpt
      headline
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

const GET_ARTICLES_COUNT = gql`
  query conatctsCountQuery {
    getArticleCount
  }
`;

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "author",
    numeric: false,
    disablePadding: false,
    label: "Author",
  },
  {
    id: "Excerpt",
    numeric: false,
    disablePadding: false,
    label: "Excerpt",
  },
  {
    id: "Headline",
    numeric: false,
    disablePadding: false,
    label: "Headline",
  },
];

function ArticleList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("title");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ articleFilter: "" });
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [articleId, setArticleId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setArticleId(id);
  };
  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const getFilter = () => {
    return filterState.articleFilter.length > 0
      ? "*" + filterState.articleFilter + "*"
      : "*";
  };

  const { loading, data, error, refetch } = useQuery(GET_ARTICLES, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: `${orderByMe}_${order}`,
      filter: getFilter(),
    },
  });

  const articleUpdate = (id, index) => {
    if (!!field && fieldValue !== data.article[index][field]) {
      updateArticle({
        variables: {
          field: "article." + field,
          value: fieldValue,
          articleId: id,
        },
        update: () => refetch(),
      });
    }
    setIsEditMode({});
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByMe === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(property);
  };

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value;

    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setIsEditMode({});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: articlesCountQueryLoading,
    data: articlesCount,
    error: articlesCountQueryError,
  } = useQuery(GET_ARTICLES_COUNT);

  const [
    updateArticle,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_ARTICLE);

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Article List
      </Typography>

      <TextField
        id="search"
        label="Article Title Contains"
        className={classes.textField}
        value={filterState.articleFilter}
        onChange={handleFilterChange("articleFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.inputCell,
        }}
      />

      <Link variant="body2" color="primary" to="/article/create">
        <Button color="primary" type="button">
          New Article
        </Button>
      </Link>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderByMe === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderByMe === headCell.id}
                    direction={orderByMe === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id, false)}
                  >
                    {headCell.label}
                    {orderByMe === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.article.map(
              ({ __typename, id, author, excerpt, headline }, index) => {
                return (
                  <TableRow
                    key={__typename + "-" + id}
                    hover
                    article="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["title"] ? (
                        <>
                          <TextField
                            label="Headline"
                            onChange={handleChange}
                            id="headline"
                            defaultValue={headline}
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link className="edit-link" to={"/articles/" + id}>
                            {headline}
                          </Link>
                        </>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["author"] ? (
                        <>
                          <TextField
                            label="Author"
                            onChange={handleChange}
                            id="headline"
                            defaultValue={author}
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>{author}</>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["excerpt"] ? (
                        <>
                          <TextField
                            label="Excerpt"
                            onChange={handleChange}
                            id="headline"
                            defaultValue={excerpt}
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>{excerpt}</>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["headline"] ? (
                        <>
                          <TextField
                            label="Headline"
                            onChange={handleChange}
                            id="headline"
                            defaultValue={headline}
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>{headline}</>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button onClick={() => callDeleteDialog(id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
      {articlesCountQueryLoading && !articlesCountQueryError && (
        <p>Loading...</p>
      )}
      {articlesCountQueryError && !articlesCountQueryLoading && <p>Error</p>}

      {articlesCount &&
        !articlesCountQueryLoading &&
        !articlesCountQueryError && (
          <TablePagination
            component="div"
            count={articlesCount.getArticleCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      <DeleteArticleDialog
        key={"DeleteArticle"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        articleId={articleId}
        title="Article"
        refetch={refetch}
      ></DeleteArticleDialog>
    </Paper>
  );
}

export default withStyles(styles)(ArticleList);
//set Contacts and Companies as Clients through creating process
