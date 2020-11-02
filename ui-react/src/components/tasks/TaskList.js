import React from "react";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DeleteTaskDialog from "../dialogs/delete-task-dialog";
import { useMutation, useQuery } from "@apollo/client";
import TablePagination from "@material-ui/core/TablePagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  TextField,
} from "@material-ui/core";

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
  input: {
    maxWidth: 100,
  },
  inputCell: {
    maxWidth: "100%",
  },
  tableCell: {
    maxWidth: "100%",
  },
});

const GET_TASKS = gql`
  query tasksPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_TaskOrdering]
    $filter: String
  ) {
    task(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      type
      priority
      title
      notes
      due_date {
        formatted
      }
      assigned {
        id
        first_name
        last_name
      }
      created_at {
        formatted
      }
    }
  }
`;
const UPDATE_TASK = gql`
  mutation updateTask($field: String, $value: String, $taskId: String) {
    updateTask(field: $field, value: $value, taskId: $taskId) {
      id
    }
  }
`;

const GET_TASKS_COUNT = gql`
  query conatctsCountQuery {
    getTaskCount
  }
`;

const headCells = [
  {
    id: "node.title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  {
    id: "node.type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "node.priority",
    numeric: false,
    disablePadding: false,
    label: "Priority",
  },
  {
    id: "node.due_date",
    numeric: false,
    disablePadding: false,
    label: "Due Date",
  },
  {
    id: "user.first_name",
    numeric: false,
    disablePadding: false,
    label: "Assigned To",
  },
  {
    id: "node.notes",
    numeric: false,
    disablePadding: false,
    label: "Notes",
  },
];

function TaskList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [orderByMe, setOrderByMe] = React.useState("node.first_name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ taskFilter: "" });
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [taskId, setTaskId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setTaskId(id);
  };
  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const getFilter = () => {
    return filterState.taskFilter.length > 0
      ? "*" + filterState.taskFilter + "*"
      : "*";
  };

  const { loading, data, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: `${orderBy}_${order}`,
      filter: getFilter(),
    },
  });

  const taskUpdate = (id, index) => {
    if (!!field && fieldValue !== data.task[index][field]) {
      updateTask({
        variables: {
          field: "task." + field,
          value: fieldValue,
          taskId: id,
        },
        update: () => refetch(),
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByMe === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(property);
  };

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value;

    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
    console.log(event.target.id, event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: tasksCountQueryLoading,
    data: tasksCount,
    error: tasksCountQueryError,
  } = useQuery(GET_TASKS_COUNT);

  const [
    updateTask,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_TASK);

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Task List
      </Typography>

      <TextField
        id="search"
        label="Task Title Contains"
        className={classes.textField}
        value={filterState.taskFilter}
        onChange={handleFilterChange("taskFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.inputCell,
        }}
      />

      <Link variant="body2" color="primary" to="/task/create">
        <Button color="primary" type="button">
          New Task
        </Button>
      </Link>

      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.task.map(
              (
                {
                  __typename,
                  id,
                  title,
                  type,
                  priority,
                  due_date,
                  assigned,
                  notes,
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
                      {isEditMode["title"] ? (
                        <>
                          <TextField
                            label="Title"
                            onChange={handleChange}
                            id="title"
                            defaultValue={title}
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
                          <Link className="edit-link" to={"/tasks/" + id}>
                            {title}
                          </Link>
                        </>
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["type"] && isEditMode["type"]["id"] === id ? (
                        <>
                          <TextField
                            className={classes.inputCell}
                            label="type"
                            onChange={handleChange}
                            id="type"
                            defaultValue={type}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => taskUpdate(id, index)}
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
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ type: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {type ? type : "no type yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["priority"] &&
                      isEditMode["priority"]["id"] === id ? (
                        <>
                          <TextField
                            label="priority"
                            onChange={handleChange}
                            id="priority"
                            defaultValue={priority}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => taskUpdate(id, index)}
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
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ priority: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {priority ? priority : "no priority yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode["due_date"] &&
                      isEditMode["due_date"]["id"] === id ? (
                        <>
                          <TextField
                            type="date"
                            label="due date"
                            onChange={handleChange}
                            id="due_date"
                            defaultValue={due_date}
                            size="small"
                            style={{
                              width: 200,
                            }}
                          />

                          <br />
                          <Button
                            onClick={() => taskUpdate(id, index)}
                            color="primary"
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ due_date: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {due_date && due_date.formatted
                            ? due_date.formatted
                            : "no date yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {assigned
                        ? `${assigned.first_name} ${assigned.last_name}`
                        : "no data yet"}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["notes"] &&
                      isEditMode["notes"]["id"] === id ? (
                        <>
                          <TextField
                            label="notes"
                            onChange={handleChange}
                            id="notes"
                            defaultValue={notes}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => taskUpdate(id, index)}
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
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ notes: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {notes ? notes : "no notes yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => callDeleteDialog(id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
      {tasksCountQueryLoading && !tasksCountQueryError && <p>Loading...</p>}
      {tasksCountQueryError && !tasksCountQueryLoading && <p>Error</p>}

      {tasksCount && !tasksCountQueryLoading && !tasksCountQueryError && (
        <TablePagination
          component="div"
          count={tasksCount.getTaskCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      <DeleteTaskDialog
        key={"DeleteTask"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        taskId={taskId}
        title="Task"
        refetch={refetch}
      ></DeleteTaskDialog>
    </Paper>
  );
}

export default withStyles(styles)(TaskList);
