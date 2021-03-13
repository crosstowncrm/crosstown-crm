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

import DeleteEmailDialog from "../dialogs/delete-email-dialog";

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
      created {
        formatted
      }
      sent_by_user {
        User {
          id
          first_name
          last_name
        }
      }
      sent_to_contact {
        Contact {
          id
          first_name
          last_name
        }
      }
    }
  }
`;

const GET_EMAILS_COUNT = gql`
  query emailsCountQuery {
    getEmailCount
  }
`;

const headCells = [
  {
    id: "node.name",
    numeric: false,
    disablePadding: false,
    label: "Sent By User",
  },
  {
    id: "user.first_name",
    numeric: false,
    disablePadding: false,
    label: "Sent To Contact",
  },
  {
    id: "contact.first_name",
    numeric: false,
    disablePadding: false,
    label: "Subject",
  },
  {
    id: "node.created",
    numeric: false,
    disablePadding: false,
    label: "Create Date",
  },
  {
    id: "node.sent",
    numeric: false,
    disablePadding: false,
    label: "Sent Date",
  },
];

function EmailList(props) {
  const { classes, numSelected, rowCount, onRequestSort } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.created");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ emailFilter: "" });
  const [emailId, setEmailId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setEmailId(id);
  };

  const getFilter = () => {
    return filterState.emailFilter.length > 0
      ? "*" + filterState.emailFilter + "*"
      : "*";
  };

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
    orderByMe: `${orderByMe} ${order}`,
    filter: getFilter(),
  };

  let { loading, data, error, refetch } = useQuery(GET_EMAILS, {
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
    loading: emailsCountQueryLoading,
    data: emailsCount,
    error: emailsCountQueryError,
  } = useQuery(GET_EMAILS_COUNT);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Email List
      </Typography>
      <TextField
        id="search"
        label="Email Subject Contains"
        className={classes.textField}
        value={filterState.emailFilter}
        onChange={handleFilterChange("emailFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      <Link variant="body2" color="primary" to="/email/create">
        <Button color="primary" type="button">
          New Email
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
                  inputProps={{
                    "aria-label": "select all emails",
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
            {data.email.map(
              ({ id, created, sent_by_user, sent_to_contact, subject }) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={"email-" + id}
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
                    <TableCell>
                      {sent_by_user ? (
                        <Link
                          variant="body2"
                          color="primary"
                          to={"/users/" + sent_by_user.User.id}
                        >
                          {sent_by_user.User.first_name +
                            " " +
                            sent_by_user.User.last_name}
                        </Link>
                      ) : (
                        "no data yet"
                      )}
                    </TableCell>
                    <TableCell>
                      {sent_to_contact ? (
                        <Link
                          variant="body2"
                          color="primary"
                          to={"/contacts/" + sent_to_contact.Contact.id}
                        >
                          {sent_to_contact.Contact.first_name +
                            " " +
                            sent_to_contact.Contact.last_name}
                        </Link>
                      ) : (
                        "no data yet"
                      )}
                    </TableCell>
                    <TableCell>
                      {subject ? (
                        <Link
                          variant="body2"
                          color="primary"
                          to={"/emails/" + id}
                        >
                          {subject}
                        </Link>
                      ) : (
                        "no data yet"
                      )}
                    </TableCell>
                    <TableCell>
                      {created ? created.formatted : "no date yet"}
                    </TableCell>
                    <TableCell>
                      {created ? created.formatted : "no date yet"}
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
      {emailsCountQueryLoading && !emailsCountQueryError && <p>Loading...</p>}
      {emailsCountQueryError && !emailsCountQueryLoading && <p>Error</p>}

      {emailsCount && !emailsCountQueryLoading && !emailsCountQueryError && (
        <TablePagination
          component="div"
          count={emailsCount.getEmailCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}

      <DeleteEmailDialog
        key={"DeleteEmail"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        emailId={emailId}
        title="Email"
        refetch={refetch}
      ></DeleteEmailDialog>
    </Paper>
  );
}

export default withStyles(styles)(EmailList);
