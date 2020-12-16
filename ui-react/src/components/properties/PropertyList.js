import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { useQuery, gql } from "@apollo/client";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TablePagination from "@material-ui/core/TablePagination";
import { TableSortLabel, Typography, TextField } from "@material-ui/core";
import { useMutation } from "@apollo/client";

import DeletePropertyDialog from "../dialogs/delete-property-dialog";

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

const GET_PROPERTIES = gql`
  query propertiesPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    property(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      name
      property_type
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

const GET_PROPERTIES_COUNT = gql`
  query propertiesCountQuery {
    getPropertyCount
  }
`;

const UPDATE_PROPERTY = gql`
  mutation updateProperty($field: String, $value: String, $propertyId: String) {
    updateProperty(field: $field, value: $value, propertyId: $propertyId) {
      id
    }
  }
`;

const headCells = [
  { id: "node.name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "node.property_type",
    numeric: false,
    disablePadding: false,
    label: "Lead Status",
  },
  {
    id: "node.phone",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "node.created_at",
    numeric: false,
    disablePadding: false,
    label: "Create Date",
  },
  {
    id: "owner.first_name",
    numeric: false,
    disablePadding: false,
    label: "Property Owner",
  },
];

function PropertyList(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ propertyFilter: "" });
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});
  const [propertyId, setPropertyId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setPropertyId(id);
  };

  const getFilter = () => {
    return filterState.propertyFilter.length > 0
      ? "*" + filterState.propertyFilter + "*"
      : "*";
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

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
    orderByMe: `${orderByMe} ${order}`,
    filter: getFilter(),
  };

  let { loading, data, error, refetch } = useQuery(GET_PROPERTIES, {
    variables: variables,
  });

  const createSortHandler = (property) => (event) => {
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

  const {
    loading: propertiesCountQueryLoading,
    data: propertiesCount,
    error: propertiesCountQueryError,
  } = useQuery(GET_PROPERTIES_COUNT);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleCancel = (event) => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
  };

  const propertyUpdate = (id, index) => {
    if (!!field && fieldValue !== data.property[index][field]) {
      updateProperty({
        variables: {
          field: "property." + field,
          value: fieldValue,
          propertyId: id,
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const [
    updateProperty,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_PROPERTY, {
    update: (proxy, { data: { updateProperty } }) => {
      const number = data.property.findIndex((x) => x.id === updateProperty.id);
      data.property[number][field] = fieldValue;
      proxy.writeQuery({
        query: GET_PROPERTIES,
        data: { data: data },
      });
    },
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Property List
      </Typography>
      <TextField
        id="search"
        label="Property Name Contains"
        className={classes.textField}
        value={filterState.propertyFilter}
        onChange={handleFilterChange("propertyFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      <Link variant="body2" color="primary" to="/property/create">
        <Button color="primary" type="button">
          New Property
        </Button>
      </Link>
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
                    "aria-label": "select all properties",
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
            {data.property.map(
              (
                {
                  __typename,
                  id,
                  name,
                  property_type,
                  phone,
                  created_at,
                  owner,
                },
                index
              ) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={__typename + "-" + id}
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
                      {__typename.toString() === "Property" ? (
                        <Link className="edit-link" to={"/properties/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      ) : (
                        <Link className="edit-link" to={"/properties/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["property_type"] &&
                      isEditMode["property_type"]["id"] === id ? (
                        <>
                          <TextField
                            label="lead status"
                            onChange={handleChange}
                            id="property_type"
                            defaultValue={property_type}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => propertyUpdate(id, index)}
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
                              setIsEditMode({ property_type: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {property_type ? property_type : "no lead status yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["phone"] &&
                      isEditMode["phone"]["id"] === id ? (
                        <>
                          <TextField
                            label="phone"
                            onChange={handleChange}
                            id="phone"
                            defaultValue={phone}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => propertyUpdate(id, index)}
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
                              setIsEditMode({ phone: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {phone ? phone : "no phone"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {created_at ? created_at.formatted : "no date yet"}
                    </TableCell>

                    <TableCell>
                      {owner
                        ? `${owner.first_name} ${owner.last_name}`
                        : "no owner yet"}
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
      {propertiesCountQueryLoading && !propertiesCountQueryError && (
        <p>Loading...</p>
      )}
      {propertiesCountQueryError && !propertiesCountQueryLoading && (
        <p>Error</p>
      )}

      {propertiesCount &&
        !propertiesCountQueryLoading &&
        !propertiesCountQueryError && (
          <TablePagination
            component="div"
            count={propertiesCount.getPropertyCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}

      <DeletePropertyDialog
        key={"DeleteProperty"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        propertyId={propertyId}
        title="Property"
        refetch={refetch}
      ></DeletePropertyDialog>
    </Paper>
  );
}

export default withStyles(styles)(PropertyList);
