import React from "react";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteRoleDialog from "../dialogs/delete-role-dialog";
import { useMutation, useQuery } from "@apollo/client";
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
const UPDATE_ROLE = gql`
  mutation updateRole($field: String, $value: String, $roleId: String) {
    updateRole(field: $field, value: $value, roleId: $roleId) {
      id
    }
  }
`;

const GET_ROLES_COUNT = gql`
  query conatctsCountQuery {
    getRoleCount
  }
`;

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
];

function RoleList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ roleFilter: "" });
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [roleId, setRoleId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setRoleId(id);
  };
  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const getFilter = () => {
    return filterState.roleFilter.length > 0
      ? "*" + filterState.roleFilter + "*"
      : "*";
  };

  const { loading, data, error, refetch } = useQuery(GET_ROLES, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: `${orderByMe}_${order}`,
      filter: getFilter(),
    },
  });

  const roleUpdate = (id, index) => {
    if (!!field && fieldValue !== data.role[index][field]) {
      updateRole({
        variables: {
          field: "role." + field,
          value: fieldValue,
          roleId: id,
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
    console.log(event.target.id, event.target.value);
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
    loading: rolesCountQueryLoading,
    data: rolesCount,
    error: rolesCountQueryError,
  } = useQuery(GET_ROLES_COUNT);

  const [
    updateRole,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_ROLE);

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Role List
      </Typography>

      <TextField
        id="search"
        label="Role Title Contains"
        className={classes.textField}
        value={filterState.roleFilter}
        onChange={handleFilterChange("roleFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.inputCell,
        }}
      />

      <Link variant="body2" color="primary" to="/role/create">
        <Button color="primary" type="button">
          New Role
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
            {data.role.map(({ __typename, id, name }, index) => {
              return (
                <TableRow
                  key={__typename + "-" + id}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell align="left" className={classes.tableCell}>
                    {isEditMode["name"] ? (
                      <>
                        <TextField
                          label="Name"
                          onChange={handleChange}
                          id="name"
                          defaultValue={name}
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
                        <Link className="edit-link" to={"/roles/" + id}>
                          {name}
                        </Link>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => callDeleteDialog(id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {rolesCountQueryLoading && !rolesCountQueryError && <p>Loading...</p>}
      {rolesCountQueryError && !rolesCountQueryLoading && <p>Error</p>}

      {rolesCount && !rolesCountQueryLoading && !rolesCountQueryError && (
        <TablePagination
          component="div"
          count={rolesCount.getRoleCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      <DeleteRoleDialog
        key={"DeleteRole"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        roleId={roleId}
        title="Role"
        refetch={refetch}
      ></DeleteRoleDialog>
    </Paper>
  );
}

export default withStyles(styles)(RoleList);
//set Contacts and Companies as Clients through creating process
