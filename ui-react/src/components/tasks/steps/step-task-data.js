import React from "react";
import { makeStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import {
  TimePicker,
  DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers/";
import multiStep from "../../../multiStep/multiStep";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    display: "inline-block",
    height: "38px",
    padding: "0 30px",
    color: "#555",
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 38,
    letterSpacing: "0.1rem",
    textTransform: "uppercase",
    textDecoration: "none",
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    borderRadius: "4px",
    border: "1px solid #bbb",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  textField: {
    width: 400,
  },
  selectField: {
    width: 200,
  },
  row: {
    paddingTop: "10px",
  },
}));

const taskTypes = ["Mail", "Call", "To-Do"];
const taskPriorities = ["High", "Low", "Flash"];
const GET_CLIENTS = gql`
  query clientsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ClientOrdering]
    $filter: String
  ) {
    client(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
      typename
    }
  }
`;

const GET_USERS = gql`
  query usersPaginateQuery($first: Int, $offset: Int) {
    User(first: $first, offset: $offset) {
      id
      first_name
      last_name
    }
  }
`;

function TaskData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const classes = useStyles();
  const handleChange = (event) => {
    multiStep.saveData({
      name: event.target.name,
      value: event.target.value,
    });
    multiStep.errorRemove(event.target.name);
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const handleDateChange = (date) => {
    const newDate = new Date(date);
    multiStep.saveData({
      name: "date",
      value: newDate,
    });
    setSelectedDate(newDate);
  };

  const handleAcChange = (event, value) => {
    event.preventDefault();
    const name = event.target.id.split("-")[0];
    multiStep.saveData({
      name: name,
      value: value.id,
    });

    if (name === "associated") {
      multiStep.saveData({
        name: "label",
        value: value.typename,
      });
    }

    multiStep.saveData({
      name: `${name}_ind`,
      value: parseInt(event.target.id.split("-")[2], 10),
    });

    multiStep.errorRemove(name);
    setErrors({ ...errors, [name]: "" });
  };

  if (!multiStep.getData()["type"]) {
    multiStep.saveData({
      name: "type",
      value: "Mail",
    });
  }

  if (!multiStep.getData()["priority"]) {
    multiStep.saveData({
      name: "priority",
      value: "Low",
    });
  }

  if (!multiStep.getData()["date"]) {
    multiStep.saveData({
      name: "date",
      value: new Date(),
    });
  }

  const {
    title,
    type,
    priority,
    associated,
    date,
    notes,
    assigned,
  } = multiStep.getData();

  const { loading, data, error } = useQuery(GET_CLIENTS, {
    variables: {
      orderBy: "name_asc",
      first: 10,
      offset: 0,
    },
  });

  const { loading: userLoading, data: userData, error: userError } = useQuery(
    GET_USERS,
    {
      variables: {
        orderBy: "first_name_asc",
      },
    }
  );

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <TextField
            className={classes.textField}
            label="Title *"
            onChange={handleChange}
            name="title"
            defaultValue={title}
          />
          <div style={{ fontSize: 12, color: "red" }}>
            {errors["title"] ? errors["title"] : ""}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <FormControl
            className={classes.formControl}
            className={classes.selectField}
          >
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              native
              value={type}
              onChange={handleChange}
              inputProps={{
                name: "type",
                id: "type",
              }}
            >
              {taskTypes.map((type, index) => {
                return (
                  <option key={"tp" + index} value={type}>
                    {type}
                  </option>
                );
              })}
            </Select>
          </FormControl>{" "}
          <FormControl className={classes.selectField}>
            <InputLabel htmlFor="priority">Priority</InputLabel>
            <Select
              native
              value={priority}
              onChange={handleChange}
              inputProps={{
                name: "priority",
                id: "priority",
              }}
            >
              {taskPriorities.map((type, index) => {
                return (
                  <option key={"pr_" + index} value={type}>
                    {type}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.row}>
        <div className="six columns">
          {loading && !error && <p>Loading...</p>}
          {error && !loading && <p>Error</p>}
          {data && !loading && !error && (
            <FormControl className={classes.textField}>
              <Autocomplete
                defaultValue={
                  data.client[multiStep.getData()["associated_ind"]]
                }
                id="associated"
                name="client"
                options={data.client}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                onChange={handleAcChange}
                renderInput={(params) => (
                  <TextField
                    className={classes.textField}
                    {...params}
                    label="Associated with:"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors["associated"] ? errors["associated"] : ""}
              </div>
            </FormControl>
          )}
        </div>
      </div>
      <div className={classes.row}>
        <div className="six columns">
          {userLoading && !userError && <p>Loading...</p>}
          {userError && !userLoading && <p>Error</p>}
          {userData && !userLoading && !userError && (
            <FormControl className={classes.textField}>
              <Autocomplete
                defaultValue={userData.User[multiStep.getData()["assigned"]]}
                id="assigned"
                name="user"
                options={userData.User}
                getOptionLabel={(option) =>
                  option.first_name + " " + option.last_name
                }
                style={{ width: 300 }}
                onChange={handleAcChange}
                renderInput={(params) => (
                  <TextField
                    className={classes.textField}
                    {...params}
                    label="Assigned to:"
                    variant="outlined"
                    data-validators="isRequired"
                    required={true}
                  />
                )}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {errors["assigned"] ? errors["assigned"] : ""}
              </div>
            </FormControl>
          )}
        </div>
      </div>

      <div className="row">
        <div className="six columns">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <>
              <DatePicker
                variant="inline"
                value={selectedDate}
                disableToolbar
                onChange={handleDateChange}
              />{" "}
              <TimePicker
                variant="inline"
                value={selectedDate}
                disableToolbar
                onChange={handleDateChange}
              />
            </>
          </MuiPickersUtilsProvider>
        </div>
      </div>

      <div className="row">
        <div className="six columns">
          <TextField
            className={classes.textField}
            label="Notes"
            onChange={handleChange}
            name="notes"
            size="small"
            defaultValue={notes}
            placeholder="notes"
            multiline
            rows={2}
            rowsMax={4}
          />
        </div>
      </div>

      <Link variant="body2" color="primary" to="/tasks">
        <Button color="primary" type="button">
          Back to Tasks
        </Button>
      </Link>
    </div>
  );
}
export default TaskData;
