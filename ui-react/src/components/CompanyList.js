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


const GET_CLIENTS = gql`
    query clientsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ClientOrdering]
    $filter: String
    ){
        client(
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

function CompanyList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ clientFilter: "" });

  const getFilter = () => {
    return filterState.clientFilter.length > 0
      ? "*"+filterState.clientFilter+"*" : "*"
  };

  const { loading, data, error } = useQuery(GET_CLIENTS, {
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
        Client List
      </Typography>
      <TextField
          id="search"
          label="Client Name Contains"
          className={classes.textField}
          value={filterState.companyFilter}
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
                    Company Name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.client.map(n => {
              return (
                <TableRow key={n.__typename + "-" + n.id}>
                  <TableCell>
                      {n.__typename.toString()==="Contact" ?
                          <Link className="edit-link" to={"/contacts/"+n.id}>
                              {n.name}-{n.__typename.toString()}
                          </Link>
                          :
                          <Link className="edit-link" to={"/companies/"+n.id}>
                              {n.name}-{n.__typename.toString()}
                          </Link>}
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

export default withStyles(styles)(CompanyList);
