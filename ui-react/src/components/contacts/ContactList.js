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
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { useMutation } from "@apollo/react-hooks/lib/index";

import TablePagination from "@material-ui/core/TablePagination";

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

const GET_CONTACTS = gql`
  query contactsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    contact(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      first_name
      last_name
      email
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

const READ_ARTICLE = gql`
  mutation readArticle($reader_id: String, $article_id: String) {
    readArticle(reader_id: $reader_id, article_id: $article_id)
  }
`;

const GET_CONTACTS_COUNT = gql`
  query conatctsCountQuery {
    getContactCount
  }
`;
const headCells = [
  {
    id: "node.first_name",
    numeric: false,
    disablePadding: false,
    label: "Name"
  },
  {
    id: "node.email",
    numeric: false,
    disablePadding: false,
    label: "Email"
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

function ContactList(props) {
  const { classes, numSelected, rowCount } = props;
  const [order, setOrder] = React.useState("asc");
  const [selected, setSelected] = React.useState([]);
  const [orderByMe, setOrderByMe] = React.useState("node.first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ contactFilter: "" });

  const getFilter = () => {
    return filterState.contactFilter.length > 0
      ? "*" + filterState.contactFilter + "*"
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

  const { loading, data, error } = useQuery(GET_CONTACTS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderByMe: `${orderByMe} ${order}`,
      filter: getFilter()
    }
  });

  const createSortHandler = property => event => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByMe === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(property);
  };

  const handleFilterChange = filterName => event => {
    const val = event.target.value;

    setFilterState(oldFilterState => ({
      ...oldFilterState,
      [filterName]: val
    }));
  };

  // const [readArticle, { loading2, error2 }] = useMutation(READ_ARTICLE);

  // const handleClick = event => {
  //     readArticle({
  //         variables: {
  //             reader_id: localStorage.getItem('userId'),
  //             article_id: event.target.getAttribute("artid")
  //         }
  //     });
  // };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: contactsCountQueryLoading,
    data: contactsCount,
    error: contactsCountQueryError
  } = useQuery(GET_CONTACTS_COUNT);

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Contact List
      </Typography>

      <TextField
        id="search"
        label="Contact Name Contains"
        className={classes.textField}
        value={filterState.contactFilter}
        onChange={handleFilterChange("contactFilter")}
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
                    "aria-label": "select all contacts"
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
            {data.contact.map(
              ({
                __typename,
                id,
                first_name,
                last_name,
                email,
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
                    <TableCell>
                      <Link className="edit-link" to={"/contacts/" + id}>
                        {first_name} {last_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {email ? email : "no employees_num yet"}
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
      {contactsCountQueryLoading && !contactsCountQueryError && (
        <p>Loading...</p>
      )}
      {contactsCountQueryError && !contactsCountQueryLoading && <p>Error</p>}

      {contactsCount &&
        !contactsCountQueryLoading &&
        !contactsCountQueryError && (
          <TablePagination
            component="div"
            count={contactsCount.getContactCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
    </Paper>
  );
}

export default withStyles(styles)(ContactList);
