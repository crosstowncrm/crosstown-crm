import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteListingDialog from "../dialogs/delete-listing-dialog";
import { useMutation, useQuery, gql } from "@apollo/client";
import TablePagination from "@material-ui/core/TablePagination";

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  Paper,
  TableHead,
  TableRow,
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
});

const GET_LISTINGS = gql`
  query listingsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    listing(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      name
      investment_highlights
      noi
      price
      units
    }
  }
`;

const UPDATE_LISTING = gql`
  mutation updateListing($field: String, $value: String, $listingId: String) {
    updateListing(field: $field, value: $value, listingId: $listingId) {
      id
    }
  }
`;

const GET_LISTINGS_COUNT = gql`
  query listingsCountQuery {
    getListingCount
  }
`;

function ListingList(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [orderByMe, setOrderByMe] = React.useState("node.name");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ listingFilter: "" });
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});
  const [listingId, setListingId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const getFilter = () => {
    return filterState.listingFilter.length > 0
      ? "*" + filterState.listingFilter + "*"
      : "*";
  };

  const { loading, data, error, refetch } = useQuery(GET_LISTINGS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderByMe: `${orderByMe} ${order}`,
      filter: getFilter(),
    },
  });

  const listingUpdate = (id, index) => {
    if (!!field && fieldValue !== data.listing[index][field]) {
      updateListing({
        variables: {
          field: `listing.${field}`,
          value: fieldValue,
          listingId: id,
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleCancel = (event) => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
  };

  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setListingId(id);
  };

  const createSortHandler = (listing) => (event) => {
    handleRequestSort(event, listing);
  };

  const handleRequestSort = (event, listing) => {
    const isAsc = orderByMe === listing && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(listing);
  };

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value;
    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelecteds = rows.map((n) => n.name);
      // setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const [
    updateListing,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_LISTING, {
    update: (proxy, { data: { updateListing } }) => {
      const number = data.listing.findIndex((x) => x.id === updateListing.id);
      data.listing[number][field] = fieldValue;
      proxy.writeQuery({
        query: GET_LISTINGS,
        data: { data: data },
      });
    },
  });

  const {
    loading: listingsCountQueryLoading,
    data: listingsCount,
    error: listingsCountQueryError,
  } = useQuery(GET_LISTINGS_COUNT);

  const headCells = [
    { id: "node.name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "node.investment_highlights",
      numeric: false,
      disablePadding: false,
      label: "Investment Highlights",
    },
    {
      id: "node.noi",
      numeric: false,
      disablePadding: false,
      label: "NOI",
    },
    {
      id: "node.price",
      numeric: false,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "price.units",
      numeric: false,
      disablePadding: false,
      label: "Units",
    },
  ];

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
          className: classes.input,
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
                    "aria-label": "select all listings",
                  }}
                />
              </TableCell>
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
            {data.listing.map(
              (
                { id, name, investment_highlights, noi, price, units },
                index
              ) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={`row-${id}`}
                    hover
                    onClick={(event) => handleClick(event, id)}
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
                      <Link className="edit-link" to={"/listings/" + id}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["investment_highlights"] &&
                      isEditMode["investment_highlights"]["id"] === id ? (
                        <>
                          <TextField
                            label="investment_highlights"
                            onChange={handleChange}
                            id="investment_highlights"
                            defaultValue={investment_highlights}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => listingUpdate(id, index)}
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          id={index}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({
                                investment_highlights: { id: id },
                              });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {investment_highlights
                            ? investment_highlights
                            : "no investment highlights"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{noi ? noi : "no date yet"}</TableCell>

                    <TableCell>{price ? `${price}` : "no price yet"}</TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["units"] &&
                      isEditMode["units"]["id"] === id ? (
                        <>
                          <TextField
                            label="lead status"
                            onChange={handleChange}
                            id="units"
                            defaultValue={units}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => listingUpdate(id, index)}
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          id={index}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ units: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {units ? units : "no units yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => callDeleteDialog(id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}

      {listingsCountQueryLoading && !listingsCountQueryError && (
        <p>Loading...</p>
      )}
      {listingsCountQueryError && !listingsCountQueryLoading && <p>Error</p>}

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
      <DeleteListingDialog
        key={"DeleteDialog"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        listingId={listingId}
        title="Listing"
        refetch={refetch}
      ></DeleteListingDialog>
    </Paper>
  );
}

export default withStyles(styles)(ListingList);
