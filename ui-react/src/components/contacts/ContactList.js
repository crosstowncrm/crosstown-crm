import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";

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
  },
  input: {
    maxWidth: 100
  },
  inputCell: {
    maxWidth: "100%"
  },
  tableCell: {
    maxWidth: "100%"
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
const UPDATE_CONTACT = gql`
  mutation updateContact($field: String, $value: String, $contactId: String) {
    updateContact(field: $field, value: $value, contactId: $contactId) {
      id
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
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ contactFilter: "" });
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

  const getFilter = () => {
    return filterState.contactFilter.length > 0
      ? "*" + filterState.contactFilter + "*"
      : "*";
  };

  const { loading, data, error } = useQuery(GET_CONTACTS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderByMe: `${orderByMe} ${order}`,
      filter: getFilter()
    }
  });

  const contactUpdate = (id, index) => {
    if (!!field && fieldValue !== data.contact[index][field]) {
      updateContact({
        variables: {
          field: "contact." + field,
          value: fieldValue,
          contactId: id
        }
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

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

  const handleChange = event => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleCancel = event => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
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

  const [
    updateContact,
    { loading: cndMutationLoading, error: cndQMutationError }
  ] = useMutation(UPDATE_CONTACT, {
    update: (proxy, { data: { updateContact } }) => {
      const number = data.contact.findIndex(x => x.id === updateContact.id);
      data.contact[number][field] = fieldValue;
      proxy.writeQuery({
        query: GET_CONTACTS,
        data: { data: data }
      });
    }
  });

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
          className: classes.inputCell
        }}
      />
      <Link variant="body2" color="primary" to="/contact/create">
        <Button color="primary" type="button">
          New Contact
        </Button>
      </Link>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
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
              (
                {
                  __typename,
                  id,
                  first_name,
                  last_name,
                  email,
                  lead_status,
                  phone,
                  created_at,
                  owner
                },
                index
              ) => {
                return (
                  <TableRow
                    key={__typename + "-" + id}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["first_name"] ? (
                        <>
                          <TextField
                            label="First Name"
                            onChange={handleChange}
                            id="first_name"
                            defaultValue={first_name}
                          />
                          <TextField
                            label="Last Name"
                            onChange={handleChange}
                            id="last_name"
                            defaultValue={last_name}
                          />
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link className="edit-link" to={"/contacts/" + id}>
                            {first_name} {last_name}
                          </Link>
                        </>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["email"] &&
                      isEditMode["email"]["id"] === id ? (
                        <>
                          <TextField
                            className={classes.inputCell}
                            label="email"
                            onChange={handleChange}
                            id="email"
                            defaultValue={email}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => contactUpdate(id, index)}
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
                          onDoubleClick={event => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ email: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["lead_status"] &&
                      isEditMode["lead_status"]["id"] === id ? (
                        <>
                          <TextField
                            label="lead status"
                            onChange={handleChange}
                            id="lead_status"
                            defaultValue={lead_status}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => contactUpdate(id, index)}
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
                          onDoubleClick={event => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ lead_status: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {lead_status}
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
                            onClick={() => contactUpdate(id, index)}
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
                          onDoubleClick={event => {
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
