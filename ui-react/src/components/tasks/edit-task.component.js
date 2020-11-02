import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import TextField from "@material-ui/core/TextField";
import AddCompanyDialog from "../dialogs/add-company-dialog";
import ChangeAddressDialog from "../dialogs/change-address-dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";

import { CardHeader, Divider } from "@material-ui/core";
import { useMutation } from "@apollo/client";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_TASK = gql`
  query taskQuery($id: ID) {
    Task(id: $id) {
      id
      assigned {
        id
        first_name
        last_name
      }
      associated {
        id
        name
      }
      created_at {
        formatted
      }
      due_date {
        formatted
      }
      notes
      priority
      title
      type
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

const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $taskId: String
    $label: String
  ) {
    updateData(
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $taskId
      label: $label
    )
  }
`;

const GET_USERS = gql`
  query User {
    User {
      id
      first_name
      last_name
    }
  }
`;

function TaskEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const [editTitleMode, setEditTitleMode] = React.useState(false);
  const [editTypeMode, setEditTypeMode] = React.useState(false);
  const [editPriorityMode, setEditPriorityMode] = React.useState(false);
  const [editNotesMode, setEditNotesMode] = React.useState(false);
  const [editDueDateMode, setEditDueDateMode] = React.useState(false);
  const [openDialogComponent, setOpenDialogComponent] = React.useState(false);
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

  const callDialog = () => {
    setOpenDialogComponent(true);
  };

  const handleCloseDialogComponent = () => {
    setOpenDialogComponent(false);
  };

  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };

  const setAllFalse = () => {
    setField(false);
    setFieldValue(false);
    editTitleMode(false);
    setEditTypeMode(false);
    setEditPriorityMode(false);
    setEditNotesMode(false);
    setEditDueDateMode(false);
    setEngaged(false);
  };

  const { loading, data, error, refetch } = useQuery(GET_TASK, {
    variables: {
      id: params["uid"],
    },
  });

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError,
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== data.Task[0][field]) {
      updateTask({
        variables: {
          field: "task." + field,
          value: fieldValue,
          taskId: params["uid"],
        },
      });
    }
    setAllFalse();
  };

  const handleAcSubmit = (event) => {
    event.preventDefault();
    updateData({
      variables: {
        nodeLabel: event.target.name,
        nodeId: fieldValue,
        taskId: params["uid"],
        label: "Task",
      },
      update: refetch,
    });
    setAllFalse();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleAcChange = (event, value) => {
    event.preventDefault();
    setField("id");
    setFieldValue(value.id);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setAllFalse();
  };

  const [
    updateTask,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_TASK, {
    update: () => refetch(),
  });

  const [
    updateData,
    { loading: undMutationLoading, error: undQMutationError },
  ] = useMutation(UPDATE_DATA, {});

  return (
    <>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={2}
          style={{
            border: "3px solid blue",
            margin: "12px",
            width: "98%",
          }}
        >
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              About
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.Task.map(
                ({
                  id,
                  assigned,
                  associated,
                  created_at,
                  due_date,
                  notes,
                  priority,
                  title,
                  type,
                }) => (
                  <Card key={`card-${id}`}>
                    <CardContent>
                      <Avatar>***</Avatar>
                      <Typography gutterBottom variant="h5" component="h2">
                        {title ? title : "no data"}
                      </Typography>
                    </CardContent>
                    <CardActionArea>
                      <CardActions>
                        <Link to="/" size="small" color="primary">
                          Note
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Email
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Call
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Log
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Task
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Meet
                        </Link>
                      </CardActions>
                    </CardActionArea>
                    <Divider />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {" "}
                        {editTitleMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="Title"
                              onClick={handleChange}
                              onChange={handleChange}
                              id="title"
                              defaultValue={title}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditTitleMode(!editTitleMode);
                                setEngaged(true);
                              } else setEditTitleMode(editTitleMode);
                            }}
                          >
                            Title: {title}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editTypeMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="Type"
                              onChange={handleChange}
                              id="type"
                              defaultValue={type}
                              size="small"
                            />{" "}
                            :
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditTypeMode(!editTypeMode);
                                setEngaged(true);
                              } else setEditTypeMode(editTypeMode);
                            }}
                          >
                            Type: {type}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editPriorityMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="priority"
                              onChange={handleChange}
                              id="priority"
                              defaultValue={priority}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditPriorityMode(!editPriorityMode);
                                setEngaged(true);
                              } else setEditPriorityMode(editPriorityMode);
                            }}
                          >
                            Priority: {priority}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editNotesMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              label="notes"
                              onChange={handleChange}
                              id="notes"
                              defaultValue={notes}
                              size="small"
                            />
                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditNotesMode(!editNotesMode);
                                setEngaged(true);
                              } else setEditNotesMode(editNotesMode);
                            }}
                          >
                            notes: {notes}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {editDueDateMode ? (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              type="date"
                              label="due_date"
                              onChange={handleChange}
                              id="due_date"
                              defaultValue={due_date.formatted}
                              size="small"
                              style={{
                                width: 200,
                              }}
                            />

                            <br />
                            <Button color="primary" type="submit">
                              Update
                            </Button>
                            <Button color="secondary" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <span
                            onDoubleClick={(event) => {
                              event.preventDefault();
                              if (!engaged) {
                                setEditDueDateMode(!editDueDateMode);
                                setEngaged(true);
                              } else setEditDueDateMode(editDueDateMode);
                            }}
                          >
                            due_date: {due_date.formatted}
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        <span>created_at: {created_at.formatted}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>associated:</span>
                        <span>{associated.name}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>assigned:</span>
                        <span>
                          {assigned.first_name} {assigned.last_name}
                        </span>
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Activity
            </Grid>
          </Grid>
        </Grid>
      )}
      <ChangeAddressDialog
        key={"changeAddress"}
        isOpen={openAddressDialogComponent}
        handleClose={handleCloseAddressDialogComponent}
        unitId={params["uid"]}
        title="Address"
        refetch={refetch}
        label="Task"
      ></ChangeAddressDialog>
      <AddCompanyDialog
        key={"addCompany"}
        isOpen={openDialogComponent}
        handleClose={handleCloseDialogComponent}
        taskId={params["uid"]}
        title="Associations"
        refetch={refetch}
      ></AddCompanyDialog>
    </>
  );
}

export default withStyles(styles)(TaskEdit);
