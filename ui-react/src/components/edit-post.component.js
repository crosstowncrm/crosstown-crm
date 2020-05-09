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
  Paper,
  Typography
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

const GET_POST = gql`
  query userQuery($id: ID) {
    Post(id: $id) {
      id
      title
      meta
      keywords
      content
      link
      viewed_post {
          timestamp {
              formatted
          }
          Contact {
              id
              first_name
          }
      }
      shared_post {
          timestamp {
              formatted
          }
          Contact {
              id
              first_name
          }
      }
      categories {
          id
          name
      }
    }
  }
`;

function PostEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const { loading, data, error } = useQuery(GET_POST, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Post Edit
      </Typography>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="title">title</TableCell>
              <TableCell key="meta">meta</TableCell>
              <TableCell key="keywords">keywords</TableCell>
              <TableCell key="content">content</TableCell>
              {/*<TableCell key="images">images</TableCell>*/}
              <TableCell key="link">link</TableCell>
              <TableCell key="viewed_post">viewed post</TableCell>
              <TableCell key="shared_post">shared post</TableCell>
              <TableCell key="categories">categories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Post.map(post => {
              return (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.meta}</TableCell>
                  <TableCell>{post.keywords}</TableCell>
                  <TableCell>{post.content}</TableCell>
                  {/*<TableCell>*/}
                  {/*{post.images.map(image => (*/}
                      {/*{image}*/}
                  {/*))}*/}
                  {/*</TableCell>*/}
                  <TableCell>{post.link}</TableCell>
                  <TableCell>
                    {post.viewed_post.map(viewed => (
                        <Link  key={viewed.Contact.id} className="edit-link" to={"/contacts/" + viewed.Contact.id}>
                            {viewed.Contact.first_name} {viewed.timestamp.formatted}
                        </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                    {post.shared_post.map(shared => (
                         <Link  key={shared.Contact.id} className="edit-link" to={"/contacts/" + shared.Contact.id}>
                             {shared.Contact.first_name} {shared.timestamp.formatted}
                         </Link>
                    ))}
                  </TableCell>
                  <TableCell>
                        {post.categories.map(category => (
                            <Link key={category.id} className="edit-link" to={"/categories/" + category.id}>
                                {category.name}
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

export default withStyles(styles)(PostEdit);
