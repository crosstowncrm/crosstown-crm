import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
  Paper,
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

const GET_ARTICLE = gql`
  query userQuery($id: ID) {
    Article(id: $id) {
      id
      title
      excerpt
      content
      source
      link
      event_time {
        formatted
      }
      categories {
        id
        name
      }
      viewed {
        timestamp {
          formatted
        }
        Contact {
          id
          first_name
        }
      }
      shared {
        timestamp {
          formatted
        }
        Contact {
          id
          first_name
        }
      }
      opened_source {
        timestamp {
          formatted
        }
        Contact {
          id
          first_name
        }
      }
    }
  }
`;

function ArticleEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const { loading, data, error } = useQuery(GET_ARTICLE, {
    variables: {
      id: params["uid"],
    },
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Article Edit
      </Typography>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="title">title</TableCell>
              <TableCell key="excerpt">excerpt</TableCell>
              <TableCell key="content">content</TableCell>
              <TableCell key="source">source</TableCell>
              <TableCell key="link">link</TableCell>
              <TableCell key="categories">categories</TableCell>
              <TableCell key="viewed">viewed</TableCell>
              <TableCell key="shared">shared</TableCell>
              <TableCell key="opened_source">opened source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Article.map((article) => {
              return (
                <TableRow key={article.id}>
                  <TableCell>
                    {article.title ? article.title : "no data"}
                  </TableCell>
                  <TableCell>
                    {article.excerpt ? article.excerpt : "no data"}
                  </TableCell>
                  <TableCell>
                    {article.content ? article.content : "no data"}
                  </TableCell>
                  <TableCell>
                    {article.source ? article.source : "no data"}
                  </TableCell>
                  <TableCell>
                    {article.link ? article.link : "no data"}
                  </TableCell>
                  <TableCell>
                    {article.categories.map((category) => (
                      <Link
                        key={category.id}
                        className="edit-link"
                        to={"/categories/" + category.id}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                    {article.viewed.map((viewed) => (
                      <Link
                        key={viewed.Contact.id}
                        className="edit-link"
                        to={"/contacts/" + viewed.Contact.id}
                      >
                        {viewed.Contact.first_name} {viewed.timestamp.formatted}
                      </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                    {article.shared.map((shared) => (
                      <Link
                        key={shared.Contact.id}
                        className="edit-link"
                        to={"/contacts/" + shared.Contact.id}
                      >
                        {shared.Contact.first_name} {shared.timestamp.formatted}
                      </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                    {article.opened_source.map((opened) => (
                      <Link
                        key={opened.Contact.id}
                        className="edit-link"
                        to={"/contacts/" + opened.Contact.id}
                      >
                        {opened.Contact.first_name} {opened.timestamp.formatted}
                      </Link>
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

export default withStyles(styles)(ArticleEdit);
