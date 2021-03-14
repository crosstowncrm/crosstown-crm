import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Divider,
  CardContent,
  Typography,
  CardActionArea,
  Avatar,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import FieldComponent from "./field-component";
import { useMutation, useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import ChangeAddressDialog from "../../dialogs/change-address-dialog";

const UPDATE_EMAIL = gql`
  mutation updateEmail($field: String, $value: String, $emailId: String) {
    updateEmail(field: $field, value: $value, emailId: $emailId) {
      id
    }
  }
`;

const headCells = ["Note", "Email", "Call", "Log", "Task", "Meet"];

const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $emailId: String
    $label: String
  ) {
    updateData(
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $emailId
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

export default function GridEmailComponent({ emails, refetch, emailId }) {
  const [editSubjectMode, setEditSubjectMode] = React.useState(false);
  const [editOwnerMode, setEditOwnerMode] = React.useState(false);
  const [editPhoneMode, setEditPhoneMode] = React.useState(false);
  const [editCAMode, setEditCAMode] = React.useState(false);
  const [editDNMode, setEditDNMode] = React.useState(false);
  const [editWUMode, setEditWUMode] = React.useState(false);
  const [editDMode, setEditDMode] = React.useState(false);
  const [editLiMode, setEditLiMode] = React.useState(false);

  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);

  const callAddressDialog = () => {
    setOpenAddressDialogComponent(true);
  };

  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };

  const {
    loading: usersQueryLoading,
    data: users,
    error: usersQueryError,
  } = useQuery(GET_USERS, {
    variables: {
      orderBy: "first_name_asc",
    },
  });
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

  const setAllFalse = () => {
    setField(false);
    setFieldValue(false);
    setEditSubjectMode(false);
    setEditOwnerMode(false);
    setEditCAMode(false);
    setEditWUMode(false);
    setEditLiMode(false);
    setEditDMode(false);
    setEditDNMode(false);
    setEditPhoneMode(false);
    setEngaged(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== emails[0][field]) {
      updateEmail({
        variables: {
          field: "email." + field,
          value: fieldValue,
          emailId: emails[0]["id"],
        },
        update: () => refetch(),
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
        emailId: emailId,
        label: "Email",
      },
      update: () => refetch(),
    });
    setAllFalse();
  };

  const handleAcChange = (event, value) => {
    event.preventDefault();
    setField("id");
    setFieldValue(value.id);
  };

  const [
    updateEmail,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(UPDATE_EMAIL);

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setAllFalse();
  };

  const [
    updateData,
    { loading: undMutationLoading, error: undQMutationError },
  ] = useMutation(UPDATE_DATA, {});

  return (
    <>
      <Grid
        item
        md={12}
        style={{
          border: "2px solid blue",
          margin: "2px",
        }}
      >
        {emails.map(({ id, created, subject }) => (
          <Card key={"card" + id}>
            <CardContent>
              <Avatar>***</Avatar>
              <Typography gutterBottom variant="h5" component="h2">
                {subject ? subject : "no subject"}
              </Typography>
            </CardContent>
            <CardActionArea>
              <CardActions key="card-actions">
                {headCells.map((headCell) => (
                  <Link
                    to="/"
                    size="small"
                    color="primary"
                    key={"head_" + headCell}
                  >
                    {headCell}
                  </Link>
                ))}
              </CardActions>
            </CardActionArea>
            <Divider />

            <CardContent>
              <FieldComponent
                title="Subject"
                value={subject}
                editMode={editSubjectMode}
                setEditMode={setEditSubjectMode}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                engaged={engaged}
                setEngaged={setEngaged}
                handleCancel={handleCancel}
              ></FieldComponent>
              <Typography variant="body2" color="textSecondary" component="div">
                <span>created at: {created.formatted}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <span>sent at: {created.formatted}</span>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </>
  );
}
