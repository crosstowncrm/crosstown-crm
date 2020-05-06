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

const GET_ARTICLE = gql`
  query articlesPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ArticleOrdering]
  ) {
    Article(first: $first, offset: $offset, orderBy: $orderBy) {
      id
      title
      event{
          year
      }
      excerpt
      recommendations{
          id
          first_name
      }
    }
  }
`;

function ArticleList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("event");

  const { loading, data, error } = useQuery(GET_ARTICLE, {
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
        Article List
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="event"
                sortDirection={orderBy === "event" ? order : false}
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === "event"}
                    direction={order}
                    onClick={() => handleSortRequest("event")}
                  >
                    Article data
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Article.map(article => {
              return (
                <TableRow key={article.id}>
                    <TableCell>
                      <Link className="edit-link" to={"/articles/" + article.id}>
                        {article.excerpt}
                      </Link>
                        <p>
                            Recommended to contacts:
                        </p>
                        {article.recommendations.map(contact => (
                            <p>
                                <Link className="edit-link" to={"/contacts/" + contact.id}>
                                        {contact.first_name}
                                </Link>
                            </p>
                        ))}
                        {/*{article.event.year}*/}
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
