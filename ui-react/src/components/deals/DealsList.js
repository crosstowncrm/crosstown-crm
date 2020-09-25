import React from "react";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { useMutation, useQuery } from "@apollo/react-hooks/lib/index";
import { Typography, TextField, Button, Dialog } from "@material-ui/core";

import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TablePagination from "@material-ui/core/TablePagination";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";

import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  rootl: {
    maxWidth: 345
  },
  medial: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expandl: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpenl: {
    transform: "rotate(180deg)"
  },
  avatarl: {
    backgroundColor: red[500]
  },
  rootn: {
    flexGrow: 1
  },
  papern: {
    height: 140,
    width: 100
  },
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
  },
  containero: {
    display: "flex"
  },
  papero: {
    height: 200,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8
  }
});

const GET_DEALS = gql`
  query dealsPaginateQuery(
    #    $first: Int
    $offset: Int
    $orderBy: [_DealOrdering]
    $filter: _DealFilter
  ) {
    Deal(offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      start_time {
        formatted
      }
      est_date {
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
    $orderByClient: [_ClientOrdering]
    $filter: String
  ) {
    client(
      first: $first
      offset: $offset
      orderBy: $orderByClient
      filter: $filter
    ) {
      id
      name
    }
  }
`;

const GET_PROPERTIES = gql`
  query propertiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderByProp: [_PropertyOrdering]
    $filter: _PropertyFilter
  ) {
    Property(
      first: $first
      offset: $offset
      orderBy: $orderByProp
      filter: $filter
    ) {
      id
      name
    }
  }
`;

const GET_DEALS_COUNT = gql`
  query dealsCountQuery {
    getDealCount
  }
`;

function DealsList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [orderByClient, setorderByClient] = React.useState("name");
  const [orderByProp, setorderByProp] = React.useState("name");
  const [expanded, setExpanded] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ dealFilter: "" });
  const [open, setOpen] = React.useState(false);
  const [formData, updateFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const getFilter = () => {
    return filterState.dealFilter.length > 0
      ? { title_contains: filterState.dealFilter }
      : {};
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
      orderBy: orderByClient + "_" + order
    }
  });

  const {
    loading: propertiesQueryLoading,
    data: properties,
    error: propertiesQueryError
  } = useQuery(GET_PROPERTIES, {
    variables: {
      orderBy: orderByProp + "_" + order
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

  const validate = values => {
    let clientError = "";
    let actionError = "";
    let propertyError = "";
    let amountError = "";
    let livingError = "";
    let est_dateError = "";

    if (!values.client) {
      clientError = "Required";
    }
    if (!values.action) {
      actionError = "Required";
    }
    if (!values.property) {
      propertyError = "Required";
    }
    if (!values.amount) {
      amountError = "Required";
    }
    if (!values.living) {
      livingError = "Required";
    }
    if (!values.est_date) {
      est_dateError = "Required";
    }
    if (
      clientError ||
      actionError ||
      propertyError ||
      amountError ||
      livingError ||
      est_dateError
    ) {
      setErrors({
        clientError,
        actionError,
        propertyError,
        amountError,
        livingError,
        est_dateError
      });
      return false;
    }

    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const isValid = validate(formData);
    if (isValid) {
      createNewDeal({
        variables: formData
      });
      // clear form
      updateFormData({});
      handleClose();
    }
  };

  //type
  const actions = [
    { name: "Sales", id: 1 },
    { name: "Leases", id: 2 },
    { name: "Buys", id: 3 },
    { name: "Rents", id: 4 }
  ];
  // strategy
  const livings = [
    { name: "Commercial", id: 1 },
    { name: "Residential", id: 2 }
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
      ) {
        id
        start_time {
          formatted
        }
        est_date {
          formatted
        }
        client {
          id
          name
        }
        property {
          id
          name
        }
      }
    }
  `;

  const [
    createNewDeal,
    { loading: cndMutationLoading, error: cndQMutationError }
  ] = useMutation(CREATE_NEW_DEAL, {
    update: (proxy, { data: { createDeal } }) => {
      const data = proxy.readQuery({
        query: GET_DEALS,
        variables: {
          offset: rowsPerPage * page,
          orderBy: orderBy + "_" + order,
          filter: getFilter()
        }
      });

      data.Deal.push(createDeal);
      proxy.writeQuery({
        query: GET_DEALS,
        data: { data: data.Deal.concat(createDeal) }
      });
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: dealsCountQueryLoading,
    data: dealsCount,
    error: dealsCountQueryError
  } = useQuery(GET_DEALS_COUNT);

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
          <form className={classes.form}>
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
                    <TextField
                      {...params}
                      label="Client"
                      variant="outlined"
                      data-validators="isRequired"
                      required={true}
                    />
                  )}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {errors.clientError}
                </div>
              </FormControl>
            )}
            <FormControl className={classes.formControl}>
              <Autocomplete
                id="action"
                options={actions}
                getOptionLabel={option => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                name="action"
                renderInput={params => (
                  <TextField {...params} label="does" variant="outlined" />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.actionError}
              </div>
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
                <div style={{ fontSize: 12, color: "red" }}>
                  {errors.propertyError}
                </div>
              </FormControl>
            )}

            <FormControl className={classes.formControl}>
              <Autocomplete
                id="living"
                options={livings}
                getOptionLabel={option => option.name}
                style={{ width: 300 }}
                onChange={handleChange}
                name="living"
                renderInput={params => (
                  <TextField {...params} label="livings" variant="outlined" />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.livingError}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                label="estimated value"
                variant="outlined"
                onChange={handleChange}
                name="amount"
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors.amountError}
              </div>
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
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        New Deal
      </Button>

      {dealsQueryLoading && !dealsQueryError && <p>Loading...</p>}
      {dealsQueryError && !dealsQueryLoading && <p>Error</p>}

      {deals && !dealsQueryLoading && !dealsQueryError && (
        <Grid container spacing={2} justify="flex-start">
          {deals.Deal.map(({ id, property, client, start_time, est_date }) => {
            return (
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                  <Card className={classes.rootl}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe" className={classes.avatarl}>
                          {property.name}
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={property.name}
                      subheader={client.name}
                    />
                    <CardMedia
                      className={classes.medial}
                      image="img/grandstack.png"
                      title={property.name}
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {start_time ? start_time.formatted : "no data yet"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {client.name} has interest in {property.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {est_date ? est_date.formatted : "no data yet"}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                      <IconButton
                        className={clsx(classes.expandl, {
                          [classes.expandOpenl]: expanded
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {dealsCountQueryLoading && !dealsCountQueryError && <p>Loading...</p>}
      {dealsCountQueryError && !dealsCountQueryLoading && <p>Error</p>}

      {dealsCount && !dealsCountQueryLoading && !dealsCountQueryError && (
        <TablePagination
          component="div"
          count={dealsCount.getDealCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}

export default withStyles(styles)(DealsList);
