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
    getTask(id: $id) {
      id
      assigned {
        id
        first_name
        last_name
      }
      associated {
        id
        name
        typename
        phone
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
  const [openDialogComponent, setOpenDialogComponent] = React.useState(false);
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});

  const handleCloseDialogComponent = () => {
    setOpenDialogComponent(false);
  };

  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };

  const { loading, data, error, refetch } = useQuery(GET_TASK, {
    variables: {
      id: params["uid"],
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== data.getTask[0][field]) {
      updateTask({
        variables: {
          field: "task." + field,
          value: fieldValue,
          taskId: params["uid"],
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setIsEditMode({});
    setEngaged(false);
  };

  const [
    updateTask,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_TASK, {
    update: () => refetch(),
  });

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
              {data.getTask.map(
                ({
                  id,
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
                        {isEditMode["title"] ? (
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
                                setIsEditMode({ title: true });
                                setEngaged(true);
                              } else setIsEditMode({ title: false });
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
                        {isEditMode["type"] ? (
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
                                setIsEditMode({ type: true });
                                setEngaged(true);
                              } else setIsEditMode({ type: true });
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
                        {isEditMode["priority"] ? (
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
                                setIsEditMode({ priority: true });
                                setEngaged(true);
                              } else setIsEditMode({ priority: false });
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
                        {isEditMode["notes"] ? (
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
                                setIsEditMode({ notes: true });
                                setEngaged(true);
                              } else setIsEditMode({ notes: false });
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
                        {isEditMode["due_date"] ? (
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
                                setIsEditMode({ due_date: true });
                                setEngaged(true);
                              } else setIsEditMode({ due_date: false });
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
          <Grid item md={3}>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              Assigned, Associated
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getTask.map(({ id, assigned, associated }) => (
                <Card key={`card-${id}`}>
                  <CardContent>
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
              ))}
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
