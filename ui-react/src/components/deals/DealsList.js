import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  Typography,
  TextField,
  Link,
  Button,
  Dialog
} from "@material-ui/core";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
    Deal(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      start_time {
        formatted
      }
      close_time {
        formatted
      }
      property {
        id
        name
      }
      client {
        id
        name
      }
    }
  }
`;

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
    }
  }
`;

const GET_PROPERTIES = gql`
  query propertiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_PropertyOrdering]
    $filter: _PropertyFilter
  ) {
    Property(
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

function DealsList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ dealFilter: "" });
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);

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

  const createDeal = gql`
    mutation createDeal($client_id: String, $property_id: String) {
      createDeal(client_id: $client_id, property_id: $property_id)
    }
  `;

  const {
    loading: dealsQueryLoading,
    data: deals,
    error: dealsQueryError
  } = useQuery(GET_DEALS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: orderBy + "_" + order,
      filter: getFilter()
    }
  });

  const {
    loading: clientsQueryLoading,
    data: clients,
    error: clientsQueryError
  } = useQuery(GET_CLIENTS, {
    variables: {
      first: rowsPerPage,
      orderBy: orderBy + "_" + order
    }
  });

  const {
    loading: propertiesQueryLoading,
    data: properties,
    error: propertiesQueryError
  } = useQuery(GET_PROPERTIES, {
    variables: {
      first: rowsPerPage,
      orderBy: orderBy + "_" + order
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = form => {
    createNewDeal(form.data);
  };
  const createNewDeal = data => {};

  const actions = [
    { title: "Sales", id: 1 },
    { title: "Leases", id: 2 },
    { title: "Buys", id: 3 },
    { title: "Rents", id: 4 }
  ];

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
        onChange={handleFilterChange("dealsFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input
        }}
      />
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">New Deal</DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            {clientsQueryLoading && !clientsQueryError && <p>Loading...</p>}
            {clientsQueryError && !clientsQueryLoading && <p>Error</p>}

            {clients && !clientsQueryLoading && !clientsQueryError && (
              <FormControl>
                <Autocomplete
                  id="combo-box-demo"
                  options={clients.client}
                  getOptionLabel={option => option.name}
                  style={{ width: 300 }}
                  renderInput={params => (
                    <TextField {...params} label="Client" variant="outlined" />
                  )}
                />
              </FormControl>
            )}
            <FormControl className={classes.formControl}>
              <Autocomplete
                id="combo-box-demo"
                options={actions}
                getOptionLabel={option => option.title}
                style={{ width: 300 }}
                renderInput={params => (
                  <TextField {...params} label="does" variant="outlined" />
                )}
              />
              <FormHelperText>Some important helper text</FormHelperText>
            </FormControl>

            {propertiesQueryLoading && !propertiesQueryError && (
              <p>Loading...</p>
            )}
            {propertiesQueryError && !propertiesQueryLoading && <p>Error</p>}

            {properties && !propertiesQueryLoading && !propertiesQueryError && (
              <FormControl className={classes.formControl}>
                <FormControl>
                  <Autocomplete
                    id="combo-box-demo"
                    options={properties.Property}
                    getOptionLabel={option => option.name}
                    style={{ width: 300 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Property"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </FormControl>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleOk} color="primary">
            Сonduct
          </Button>
        </DialogActions>
      </Dialog>

      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        New Deal
      </Button>

      {dealsQueryLoading && !dealsQueryError && <p>Loading...</p>}
      {dealsQueryError && !dealsQueryLoading && <p>Error</p>}

      {deals && !dealsQueryLoading && !dealsQueryError && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Start time</TableCell>

              <TableCell>Deal Title</TableCell>

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
            {deals.Deal.map(
              ({ id, property, client, start_time, close_time }) => {
                return (
                  <TableRow key={id}>
                    <TableCell>
                      {start_time ? start_time.formatted : "no data yet"}
                    </TableCell>
                    <TableCell>
                      <Link className="edit-link" to={"/deals/" + id}>
                        {client.name} has interest in {property.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {close_time ? close_time.formatted : "no data yet"}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default withStyles(styles)(DealsList);
