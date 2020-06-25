import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
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

const GET_DEALS = gql`
  query dealsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_DealOrdering]
    $filter: _DealFilter
  ) {
      Deal(first: $first, offset: $offset, orderBy: $orderBy, filter:$filter) {
          id
          start_time{formatted}
          close_time{formatted}
          property{
              id
              name
          }
          client{
              id
              name
          }
      }
  }
`;


function DealsList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ dealFilter: "" });

  const getFilter = () => {
      return filterState.dealFilter.length > 0
          ? { title_contains: filterState.dealFilter }
          : {};
  };
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

  const { loading, data, error } = useQuery(GET_DEALS, {
    variables: {
        first: rowsPerPage,
        offset: rowsPerPage * page,
        orderBy: orderBy + "_" + order,
        filter: getFilter()
    }
  });


  return (
    <div className={classes.root}>

      <Typography variant="h2" gutterBottom>
        Deals List
      </Typography>

      <TextField
          id="search"
          label="Deal's Title Contains"
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
                <TableCell>
                    Start time
                </TableCell>

                <TableCell>
                    Deal Title
                </TableCell>

                <TableCell
                    key="event_time"
                    sortDirection={orderBy === "event_time" ? order : false}
                >
                    <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <TableSortLabel
                            active={orderBy === "event_time"}
                            direction={order}
                            onClick={() => handleSortRequest("event_time")}
                        >
                            Est. Close Date
                        </TableSortLabel>
                    </Tooltip>
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Deal.map(({id, property,  client, start_time, close_time}) => {
                return (

                    <TableRow key={id}>
                        <TableCell>
                            {start_time? start_time.formatted:"no data yet"}
                        </TableCell>
                        <TableCell>
                            <Link className="edit-link" to={"/deals/"+id}>
                                {client.name} has interest in {property.name}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {close_time? close_time.formatted:"no data yet"}
                        </TableCell>


                    </TableRow>
                );

            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default withStyles(styles)(DealsList);
