import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
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

const GET_LISTINGS = gql`
  query listingsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ListingOrdering]
    $filter: _ListingFilter
  ) {
    Listing(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      name
    }
  }
`;

const GET_LISTINGS_COUNT = gql`
  query listingsCountQuery {
    getListingCount
  }
`;

function ListingList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ listingFilter: "" });

  const getFilter = () => {
    return filterState.listingFilter.length > 0
      ? { name_contains: filterState.listingFilter }
      : {};
  };

  const { loading, data, error } = useQuery(GET_LISTINGS, {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: listingsCountQueryLoading,
    data: listingsCount,
    error: listingsCountQueryError
  } = useQuery(GET_LISTINGS_COUNT);

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Listing List
      </Typography>
      <TextField
        id="search"
        label="Listing's Name Contains"
        className={classes.textField}
        value={filterState.listingFilter}
        onChange={handleFilterChange("listingFilter")}
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
                key="name"
                sortDirection={orderBy === "name" ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={order}
                    onClick={() => handleSortRequest("name")}
                  >
                    name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Listing.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell>
                    <Link className="edit-link" to={"/listings/" + n.id}>
                      {n.name}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {listingsCountQueryLoading && !listingsCountQueryError && (
            <p>Loading...</p>
          )}
          {listingsCountQueryError && !listingsCountQueryLoading && (
            <p>Error</p>
          )}

          {listingsCount &&
            !listingsCountQueryLoading &&
            !listingsCountQueryError && (
              <TablePagination
                component="div"
                count={listingsCount.getListingCount}
                page={page}
                onChangePage={handleChangePage}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            )}
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ListingList);
