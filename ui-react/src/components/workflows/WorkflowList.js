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
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    maxWidth: 700,
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
});

const GET_WFs = gql`
  query wfPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ArticleOrdering]
  ) {
    Article(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      title
      event_time {
        formatted
      }
      recommendations {
        id
        first_name
      }
    }
  }
`;

function WorkflowList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("created_at");

  const { loading, data, error } = useQuery(GET_WFs, {
    variables: {
      orderBy: orderBy + "_" + order,
    },
  });

  const handleSortRequest = (property) => {
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
        Article List
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
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
                    Article Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Article</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Article.map((article) => {
              return (
                <TableRow key={article.id}>
                  <TableCell>{article.event_time.formatted}</TableCell>
                  <TableCell>
                    <Link className="edit-link" to={"/articles/" + article.id}>
                      {article.title}
                    </Link>
                    <p>Recommended to contacts:</p>
                    {article.recommendations.map((contact) => (
                      <p>
                        <Link
                          className="edit-link"
                          to={"/contacts/" + contact.id}
                        >
                          {contact.first_name}
                        </Link>
                      </p>
                    ))}
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

export default withStyles(styles)(ArticleList);
