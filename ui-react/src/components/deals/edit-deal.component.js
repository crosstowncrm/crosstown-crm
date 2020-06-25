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

const GET_DEAL = gql`
  query userQuery($id: ID) {
      Deal (id:$id){
          id
          start_time{formatted}
          close_time{formatted}
          value
          title
          strategy
          represents
          type
          associate
          stage
          property{
              id
              name
          }
          client{
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
      id: params["uid"]
    }
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
              <TableCell key="title">title</TableCell>
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
            {data.Deal.map(({id,title,start_time, close_time, strategy,represents,type,associate,value,stage}) => {
              return (
                <TableRow key={id}>

                  <TableCell>{title ? title: "no data"}</TableCell>
                  <TableCell>{strategy ? strategy: "no data"}</TableCell>
                  <TableCell>{start_time? start_time.formatted: "no data"}</TableCell>
                  <TableCell>{close_time? close_time.formatted: "no data"}</TableCell>
                  <TableCell>{represents ? represents: "no data"}</TableCell>
                  <TableCell>{type ? type: "no data"}</TableCell>
                  <TableCell>{associate ? associate: "no data"}</TableCell>
                  <TableCell>{value ? value: "no data"}</TableCell>
                  <TableCell>{stage ? stage: "no data"}</TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>

  );
}

export default withStyles(styles)(DealEdit);
