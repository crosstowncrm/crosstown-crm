import React from "react";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useMutation, useQuery } from "@apollo/client";
import TablePagination from "@material-ui/core/TablePagination";
import DeleteUserDialog from "./dialogs/delete-user-dialog";

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
import { withStyles } from "@material-ui/core/styles/index";

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

const GET_USERS = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    user(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      first_name
      last_name
      email
      pswd
      phone
      created_at {
        formatted
      }
      owner {
        first_name
        last_name
      }
      role {
        id
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($field: String, $value: String, $userId: String) {
    updateUser(field: $field, value: $value, userId: $userId) {
      id
    }
  }
`;

const GET_USERS_COUNT = gql`
  query usersCountQuery {
    getUserCount
  }
`;
const headCells = [
  {
    id: "node.first_name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "role.name",
    numeric: false,
    disablePadding: false,
    label: "User's Role",
  },
  {
    id: "node.email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "node.pswd",
    numeric: false,
    disablePadding: false,
    label: "Password",
  },
  {
    id: "node.phone",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "owner.first_name",
    numeric: false,
    disablePadding: false,
    label: "User's Owner",
  },
  {
    id: "node.created_at",
    numeric: false,
    disablePadding: false,
    label: "Create Date",
  },
];

const UserList = (props) => {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ userFilter: "" });
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [userId, setUserId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setUserId(id);
  };
  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const getFilter = () => {
    return filterState.userFilter.length > 0
      ? "*" + filterState.userFilter + "*"
      : "*";
  };

  const { loading, data, error, refetch } = useQuery(GET_USERS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderByMe: `${orderByMe} ${order}`,
      filter: getFilter(),
    },
  });

  const userUpdate = (id, index) => {
    if (!!field && fieldValue !== data.user[index][field]) {
      updateUser({
        variables: {
          field: "user." + field,
          value: fieldValue,
          userId: id,
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
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
    setEngaged(false);
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
    loading: usersCountQueryLoading,
    data: usersCount,
    error: usersCountQueryError,
  } = useQuery(GET_USERS_COUNT);

  const [
    updateUser,
    { loading: uuMutationLoading, error: uuQMutationError },
  ] = useMutation(UPDATE_USER, {
    update: (proxy, { data: { updateUser } }) => {
      const number = data.user.findIndex((x) => x.id === updateUser.id);
      data.user[number][field] = fieldValue;
      proxy.writeQuery({
        query: GET_USERS,
        data: { data: data },
      });
    },
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        User List
      </Typography>
      <TextField
        id="search"
        label="User's Name Contains"
        className={classes.textField}
        value={filterState.userFilter}
        onChange={handleFilterChange("userFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.inputCell,
        }}
      />

      <Link variant="body2" color="primary" to="/user/create">
        <Button color="primary" type="button">
          New User
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
            {data.user.map(
              (
                {
                  __typename,
                  id,
                  first_name,
                  last_name,
                  email,
                  pswd,
                  phone,
                  created_at,
                  owner,
                  role,
                },
                index
              ) => {
                return (
                  <TableRow
                    key={__typename + "-" + id}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["first_name"] ? (
                        <>
                          <TextField
                            label="First Name"
                            onChange={handleChange}
                            id="first_name"
                            defaultValue={first_name}
                          />
                          <TextField
                            label="Last Name"
                            onChange={handleChange}
                            id="last_name"
                            defaultValue={last_name}
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
                          <Link className="edit-link" to={"/users/" + id}>
                            {first_name} {last_name}
                          </Link>
                        </>
                      )}
                    </TableCell>
                    <TableCell>{role ? role.name : "no role"}</TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["email"] &&
                      isEditMode["email"]["id"] === id ? (
                        <>
                          <TextField
                            className={classes.inputCell}
                            label="email"
                            onChange={handleChange}
                            id="email"
                            defaultValue={email}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => userUpdate(id, index)}
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
                              setIsEditMode({ email: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {email ? email : "no email yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["pswd"] && isEditMode["pswd"]["id"] === id ? (
                        <>
                          <TextField
                            label="password"
                            onChange={handleChange}
                            id="pswd"
                            defaultValue={pswd}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => userUpdate(id, index)}
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
                              setIsEditMode({ pswd: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {pswd ? pswd : "hmm, no password yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["phone"] &&
                      isEditMode["phone"]["id"] === id ? (
                        <>
                          <TextField
                            label="phone"
                            onChange={handleChange}
                            id="phone"
                            defaultValue={phone}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => userUpdate(id, index)}
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
                              setIsEditMode({ phone: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {phone ? phone : "no phone"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {owner
                        ? `${owner.first_name} ${owner.last_name}`
                        : "no owner"}
                    </TableCell>
                    <TableCell>
                      {created_at && created_at.formatted
                        ? created_at.formatted
                        : "no date yet"}
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
      {usersCountQueryLoading && !usersCountQueryError && <p>Loading...</p>}
      {usersCountQueryError && !usersCountQueryLoading && <p>Error</p>}

      {usersCount && !usersCountQueryLoading && !usersCountQueryError && (
        <TablePagination
          component="div"
          count={usersCount.getUserCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      <DeleteUserDialog
        key={"DeleteUser"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        userId={userId}
        title="User"
        refetch={refetch}
      ></DeleteUserDialog>
    </Paper>
  );
};
export default withStyles(styles)(UserList);
