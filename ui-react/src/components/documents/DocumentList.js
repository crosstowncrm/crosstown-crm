import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { useQuery, gql } from "@apollo/client";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TablePagination from "@material-ui/core/TablePagination";
import { TableSortLabel, Typography, TextField } from "@material-ui/core";
import { useMutation } from "@apollo/client";

import DeleteDocumentDialog from "../dialogs/delete-document-dialog";

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
});

const GET_DOCUMENTS = gql`
  query documentsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    document(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
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
  query documentsCountQuery {
    getDocumentCount
  }
`;

const UPDATE_DOCUMENT = gql`
  mutation updateDocument($field: String, $value: String, $documentId: String) {
    updateDocument(field: $field, value: $value, documentId: $documentId) {
      id
    }
  }
`;

const headCells = [
  {
    id: "node.name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "node.description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "node.is_public",
    numeric: false,
    disablePadding: false,
    label: "Is Public",
  },
  {
    id: "node.created",
    numeric: false,
    disablePadding: false,
    label: "Create Date",
  },
  {
    id: "owner.first_name",
    numeric: false,
    disablePadding: false,
    label: "Document Owner",
  },
];

function DocumentList(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ documentFilter: "" });
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});
  const [documentId, setDocumentId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setDocumentId(id);
  };

  const getFilter = () => {
    return filterState.documentFilter.length > 0
      ? "*" + filterState.documentFilter + "*"
      : "*";
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelecteds = rows.map((n) => n.name);
      // setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
    orderByMe: `${orderByMe} ${order}`,
    filter: getFilter(),
  };

  let { loading, data, error, refetch } = useQuery(GET_DOCUMENTS, {
    variables: variables,
  });

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByMe === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(property);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value;
    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: documentsCountQueryLoading,
    data: documentsCount,
    error: documentsCountQueryError,
  } = useQuery(GET_DOCUMENTS_COUNT);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleCancel = (event) => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
  };

  const documentUpdate = (id, index) => {
    if (!!field && fieldValue !== data.document[index][field]) {
      updateDocument({
        variables: {
          field: "document." + field,
          value: fieldValue,
          documentId: id,
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const [
    updateDocument,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_DOCUMENT, {
    update: () => refetch(),
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Document List
      </Typography>
      <TextField
        id="search"
        label="Document Name Contains"
        className={classes.textField}
        value={filterState.documentFilter}
        onChange={handleFilterChange("documentFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      <Link variant="body2" color="primary" to="/document/create">
        <Button color="primary" type="button">
          New Document
        </Button>
      </Link>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all documents",
                  }}
                />
              </TableCell>
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
            {data.document.map(
              ({ id, name, description, is_public, created, owner }, index) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={id}
                    hover
                    onClick={(event) => handleClick(event, id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Link className="edit-link" to={"/documents/" + id}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {description ? description : "no description yet"}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["is_public"] &&
                      isEditMode["is_public"]["id"] === id ? (
                        <>
                          <TextField
                            label="is public"
                            onChange={handleChange}
                            id="is_public"
                            defaultValue={is_public}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => documentUpdate(id, index)}
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          id={index}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ is_public: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {is_public ? is_public.toString() : "no data yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {created ? created.formatted : "no date yet"}
                    </TableCell>

                    <TableCell>
                      {owner
                        ? `${owner.first_name} ${owner.last_name}`
                        : "no owner yet"}
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
      {documentsCountQueryLoading && !documentsCountQueryError && (
        <p>Loading...</p>
      )}
      {documentsCountQueryError && !documentsCountQueryLoading && <p>Error</p>}

      {documentsCount &&
        !documentsCountQueryLoading &&
        !documentsCountQueryError && (
          <TablePagination
            component="div"
            count={documentsCount.getDocumentCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}

      <DeleteDocumentDialog
        key={"DeleteDocument"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        documentId={documentId}
        title="Document"
        refetch={refetch}
      ></DeleteDocumentDialog>
    </Paper>
  );
}

export default withStyles(styles)(DocumentList);
