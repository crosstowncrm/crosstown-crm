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
import TablePagination from "@material-ui/core/TablePagination";
import { Typography } from "@material-ui/core";

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

const GET_ACTIVITIES = gql`
  query activitiesPaginateQuery($first: Int, $offset: Int) {
    activity(first: $first, offset: $offset) {
      contact {
        id
        first_name
        last_name
      }
      actionDateList
      actions
      objects
      objectIds
      last {
        objectId
        action
        date
        object
      }
    }
  }
`;

const GET_ACTIVITIES_COUNT = gql`
  query activitiesCountQuery {
    getActivityCount
  }
`;

function ActivityList(props) {
  const { classes } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isEditMode, setIsEditMode] = React.useState({});

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let { loading, data, error } = useQuery(GET_ACTIVITIES, {
    variables: variables,
  });

  const {
    loading: activitiesCountQueryLoading,
    data: activitiesCount,
    error: activitiesCountQueryError,
  } = useQuery(GET_ACTIVITIES_COUNT);

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Activity List
      </Typography>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key="contact">Contact</TableCell>
              <TableCell key="activity">Activity</TableCell>
              <TableCell key="allactivity">All Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.activity.map(
              ({
                __typename,
                id,
                contact,
                actionDateList,
                actions,
                objects,
                objectIds,
                last,
              }) => {
                return (
                  <TableRow key={__typename + "_" + contact.id}>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      component="td"
                      id={contact.id}
                    >
                      <Link
                        className="edit-link"
                        to={"/contacts/" + contact.id}
                      >
                        {contact.first_name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      {last ? (
                        <>
                          {last["date"].slice(0, -11)} {last["action"]}{" "}
                          <Link
                            className="edit-link"
                            to={
                              "/" +
                              last["object"].toString().toLowerCase() +
                              "s/" +
                              last["objectId"]
                            }
                          >
                            {last["object"]}{" "}
                          </Link>{" "}
                        </>
                      ) : (
                        "no data yet"
                      )}
                    </TableCell>

                    <TableCell>
                      {actions &&
                      isEditMode["user_id"] &&
                      isEditMode["user_id"]["id"] === contact.id ? (
                        actions.map(({ action }, i) => {
                          return (
                            <div>
                              {contact.first_name} {actions[i]}{" "}
                              {actionDateList[i].slice(0, -11)}{" "}
                              <Link
                                className="edit-link"
                                to={
                                  "/" +
                                  objects[i].toLowerCase() +
                                  "s/" +
                                  objectIds[i]
                                }
                              >
                                {objects[i]}
                              </Link>
                            </div>
                          );
                        })
                      ) : actions.length > 0 ? (
                        <Checkbox
                          checked={false}
                          onChange={(event) => {
                            event.preventDefault();
                            setIsEditMode({ user_id: { id: contact.id } });
                          }}
                          inputProps={{
                            "aria-label": "all activities",
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
      {activitiesCountQueryLoading && !activitiesCountQueryError && (
        <p>Loading...</p>
      )}
      {activitiesCountQueryError && !activitiesCountQueryLoading && (
        <p>Error</p>
      )}

      {activitiesCount &&
        !activitiesCountQueryLoading &&
        !activitiesCountQueryError && (
          <TablePagination
            component="div"
            count={activitiesCount.getActivityCount}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
    </Paper>
  );
}

export default withStyles(styles)(ActivityList);
