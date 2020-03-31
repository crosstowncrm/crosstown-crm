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

const GET_CONTACT = gql`
  query contactsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ContactOrdering]
  ) {
    Contact(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      first_name
      #      avgStars
      #      numReviews
    }
  }
`;

function ContactList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("first_name");

  const { loading, data, error } = useQuery(GET_CONTACT, {
    variables: {
      orderBy: orderBy + "_" + order
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

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Contact List
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="first_name"
                sortDirection={orderBy === "first_name" ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === "first_name"}
                    direction={order}
                    onClick={() => handleSortRequest("first_name")}
                  >
                    First Name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Contact.map(n => {
              return (
                <TableRow key={n.id}>
                  <Link className="edit-link" to={"/contacts/" + n.id}>
                    {n.first_name}
                  </Link>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(ContactList);
