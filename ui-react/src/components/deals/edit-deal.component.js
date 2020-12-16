import React from "react";
import { useQuery, gql } from "@apollo/client";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

const GET_DEAL = gql`
  query userQuery($id: ID) {
    Deal(id: $id) {
      id
      start_time {
        formatted
      }
      est_date {
        formatted
      }
      amount
      strategy {
        id
        name
      }
      type {
        id
        name
      }
      stage
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

function DealEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const { loading, data, error } = useQuery(GET_DEAL, {
    variables: {
      id: params["uid"],
    },
  });

  return (
    <div className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Deal Edit
      </Typography>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="strategy">strategy</TableCell>
              <TableCell key="start_time">start time</TableCell>
              <TableCell key="close_time">close time</TableCell>
              <TableCell key="represents">represents</TableCell>
              <TableCell key="type">type</TableCell>
              <TableCell key="associated">associated</TableCell>
              <TableCell key="value">value</TableCell>
              <TableCell key="stage">stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.Deal.map(
              ({
                id,
                start_time,
                est_date,
                strategy,
                represents,
                type,
                amount,
                stage,
                client,
                property,
              }) => {
                return (
                  <TableRow key={id}>
                    <TableCell>
                      {strategy ? strategy.name : "no data"}
                    </TableCell>
                    <TableCell>
                      {start_time ? start_time.formatted : "no data"}
                    </TableCell>
                    <TableCell>
                      {est_date ? est_date.formatted : "no data"}
                    </TableCell>
                    <TableCell>
                      {client.__typename.toString() === "Contact" ? (
                        <Link
                          className="edit-link"
                          to={"/contacts/" + client.id}
                        >
                          {client.name}
                        </Link>
                      ) : (
                        <Link
                          className="edit-link"
                          to={"/companies/" + client.id}
                        >
                          {client.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{type ? type.name : "no data"}</TableCell>
                    <TableCell>
                      <Link
                        className="edit-link"
                        to={"/properties/" + property.id}
                      >
                        {property.name}
                      </Link>
                    </TableCell>
                    <TableCell>{amount ? amount : "no data"}</TableCell>
                    <TableCell>{stage ? stage : "no data"}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default withStyles(styles)(DealEdit);
