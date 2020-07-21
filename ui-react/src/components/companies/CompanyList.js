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

const GET_COMPANIES = gql`
  query companiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    company(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      name
      employees_num
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

const GET_COMPANIES_COUNT = gql`
  query companiesCountQuery {
    getCompanyCount
  }
`;

const headCells = [
  { id: "node.name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "node.employees_num",
    numeric: false,
    disablePadding: false,
    label: "Employees num"
  },
  {
    id: "node.lead_status",
    numeric: false,
    disablePadding: false,
    label: "Lead Status"
  },
  {
    id: "node.phone",
    numeric: false,
    disablePadding: false,
    label: "Phone Number"
  },
  {
    id: "node.created_at",
    numeric: false,
    disablePadding: false,
    label: "Create Date"
  },
  {
    id: "owner.first_name",
    numeric: false,
    disablePadding: false,
    label: "Contact Owner"
  }
];

function CompanyList(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ companyFilter: "" });

  const getFilter = () => {
    return filterState.companyFilter.length > 0
      ? "*" + filterState.companyFilter + "*"
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

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
    orderByMe: `${orderByMe} ${order}`,
    filter: getFilter()
  };

  let { loading, data, error } = useQuery(GET_COMPANIES, {
    variables: variables
  });

  const createSortHandler = property => event => {
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
    loading: companiesCountQueryLoading,
    data: companiesCount,
    error: companiesCountQueryError
  } = useQuery(GET_COMPANIES_COUNT);

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Company List
      </Typography>
      <TextField
        id="search"
        label="Company Name Contains"
        className={classes.textField}
        value={filterState.companyFilter}
        onChange={handleFilterChange("companyFilter")}
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
                    "aria-label": "select all companies"
                  }}
                />
              </TableCell>
              {headCells.map(headCell => (
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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.company.map(
              ({
                __typename,
                id,
                name,
                employees_num,
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
                    <TableCell>
                      {employees_num ? employees_num : "no employees_num yet"}
                    </TableCell>
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
      {companiesCountQueryLoading && !companiesCountQueryError && (
        <p>Loading...</p>
      )}
      {companiesCountQueryError && !companiesCountQueryLoading && <p>Error</p>}

      {companiesCount &&
        !companiesCountQueryLoading &&
        !companiesCountQueryError && (
          <TablePagination
            component="div"
            count={companiesCount.getCompanyCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
    </Paper>
  );
}

export default withStyles(styles)(CompanyList);
