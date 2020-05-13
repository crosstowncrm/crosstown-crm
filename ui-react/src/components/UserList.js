import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
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
  }
});

const GET_USERS = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_UserOrdering]
    $filter: _UserFilter
  ) {
    User(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      first_name
      last_name
    }
  }
`;

function UserList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ userFilter: "" });

  const getFilter = () => {
    return filterState.userFilter.length > 0
       ? { first_name_contains: filterState.userFilter }
       : {};
  };

  const { loading, data, error } = useQuery(GET_USERS, {
    variables: {
        first: rowsPerPage,
        offset: rowsPerPage * page,
        orderBy: orderBy + "_" + order,
        filter: getFilter()
    }
  });

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const handleFilterChange = filterName => event => {
        const val = event.target.value;
        setFilterState(oldFilterState => ({
            ...oldFilterState,
            [filterName]: val
        }));
  };

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
                className: classes.input
            }}
      />
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="first_name"
                sortDirection={orderBy === "first_name" ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === "first_name"}
                    direction={order}
                    onClick={() => handleSortRequest("first_name")}
                  >
                      first name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.User.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>
                    <Link className="edit-link" to={"/users/" + n.id}>
                      {n.first_name}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(UserList);
