import React from "react";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { useMutation, useQuery } from "@apollo/react-hooks/lib/index";
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
import MenuItem from "@material-ui/core/MenuItem";
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
  const [formData, updateFormData] = React.useState({});

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
      orderBy: orderBy + "_" + order
    }
  });

  const {
    loading: propertiesQueryLoading,
    data: properties,
    error: propertiesQueryError
  } = useQuery(GET_PROPERTIES, {
    variables: {
      orderBy: orderBy + "_" + order
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e, value) => {
    let name = "";
    switch (typeof value) {
      case "object":
        let target = e.target.id.split("-");
        name = target[0];
        value = value.id;
        break;
      default:
        value = e.target.value.trim();
        name = e.target.name;
    }

    updateFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
    createNewDeal({
      variables: formData
    });
  };

  const actions = [
    { title: "Sales", id: 1 },
    { title: "Leases", id: 2 },
    { title: "Buys", id: 3 },
    { title: "Rents", id: 4 }
  ];

  const livings = [
    { title: "Commercial", id: 1 },
    { title: "Residential", id: 2 }
  ];

  const CREATE_NEW_DEAL = gql`
    mutation createDeal(
      $action: Int
      $amount: String
      $client: String
      $est_date: String
      $living: Int
      $property: String
    ) {
      createDeal(
        client_id: $client
        property_id: $property
        action: $action
        amount: $amount
        est_date: $est_date
        living: $living
      )
    }
  `;

  const [
    createNewDeal,
    { loading: cndMutationLoading, error: cndQMutationError }
  ] = useMutation(CREATE_NEW_DEAL);

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
                  id="client"
                  name="client"
                  options={clients.client}
                  getOptionLabel={option => option.name}
                  style={{ width: 300 }}
                  onChange={handleChange}
                  renderInput={params => (
                    <TextField {...params} label="Client" variant="outlined" />
                  )}
                />
              </FormControl>
            )}
            <FormControl className={classes.formControl}>
              <Autocomplete
                id="action"
                options={actions}
                getOptionLabel={option => option.title}
                style={{ width: 300 }}
                onChange={handleChange}
                name="action"
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
                <Autocomplete
                  id="property"
                  options={properties.Property}
                  getOptionLabel={option => option.name}
                  style={{ width: 300 }}
                  onChange={handleChange}
                  name="property"
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Property"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            )}

            <FormControl className={classes.formControl}>
              <Autocomplete
                id="living"
                options={livings}
                getOptionLabel={option => option.title}
                style={{ width: 300 }}
                onChange={handleChange}
                name="living"
                renderInput={params => (
                  <TextField {...params} label="livings" variant="outlined" />
                )}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                label="estimated value"
                variant="outlined"
                onChange={handleChange}
                name="amount"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                id="datetime-local"
                label="Next appointment"
                type="datetime-local"
                defaultValue="2020-08-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={handleChange}
                name="est_date"
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
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
