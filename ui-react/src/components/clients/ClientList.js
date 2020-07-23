import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import TablePagination from "@material-ui/core/TablePagination";

import { TableSortLabel, Typography, TextField } from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
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
    width: 1
  }
});

const GET_CLIENTS = gql`
  query clientsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ClientOrdering]
    $filter: String
  ) {
    client(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      email
      lead_status
      phone
      created_at {
        formatted
      }
      owner {
        first_name
        last_name
      }
    }
  }
`;

const GET_CLIENTS_COUNT = gql`
  query clientsCountQuery {
    getClientCount
  }
`;

const headCells = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "status", numeric: false, disablePadding: false, label: "Lead Status" },
  { id: "phone", numeric: false, disablePadding: false, label: "Phone Number" },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Create Date"
  },
  { id: "owner", numeric: false, disablePadding: false, label: "Contact Owner" }
];

function ClientList(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ clientFilter: "" });

  const getFilter = () => {
    return filterState.clientFilter.length > 0
      ? "*" + filterState.clientFilter + "*"
      : "*";
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      // const newSelecteds = rows.map((n) => n.name);
      // setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const { loading, data, error } = useQuery(GET_CLIENTS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: orderBy + "_" + order,
      filter: getFilter()
    }
  });

  const createSortHandler = property => event => {
    onRequestSort(event, property);
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

  const handleFilterChange = filterName => event => {
    const val = event.target.value;

    setFilterState(oldFilterState => ({
      ...oldFilterState,
      [filterName]: val
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: clientsCountQueryLoading,
    data: clientsCount,
    error: clientsCountQueryError
  } = useQuery(GET_CLIENTS_COUNT);

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Client List
      </Typography>
      <TextField
        id="search"
        label="Client Name Contains"
        className={classes.textField}
        value={filterState.clientFilter}
        onChange={handleFilterChange("clientFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input
        }}
      />
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
                    "aria-label": "select all clients"
                  }}
                />
              </TableCell>
              {headCells.map(headCell => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.client.map(
              ({
                __typename,
                id,
                name,
                email,
                lead_status,
                phone,
                created_at,
                owner
              }) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={__typename + "-" + id}
                    hover
                    onClick={event => handleClick(event, id)}
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
                      {__typename.toString() === "Contact" ? (
                        <Link className="edit-link" to={"/contacts/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      ) : (
                        <Link className="edit-link" to={"/companies/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{email ? email : "no email yet"}</TableCell>
                    <TableCell>
                      {lead_status ? lead_status : "no lead status yet"}
                    </TableCell>
                    <TableCell>{phone ? phone : "no phone yet"}</TableCell>
                    <TableCell>
                      {created_at ? created_at.formatted : "no date yet"}
                    </TableCell>

                    <TableCell>
                      {owner
                        ? `${owner.first_name} ${owner.last_name}`
                        : "no owner yet"}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
      {clientsCountQueryLoading && !clientsCountQueryError && <p>Loading...</p>}
      {clientsCountQueryError && !clientsCountQueryLoading && <p>Error</p>}

      {clientsCount && !clientsCountQueryLoading && !clientsCountQueryError && (
        <TablePagination
          component="div"
          count={clientsCount.getClientCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default withStyles(styles)(ClientList);
