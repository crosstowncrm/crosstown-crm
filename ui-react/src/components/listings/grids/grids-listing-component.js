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
import { fields } from "./../queries/edit-queries.js";

const UPDATE_LISTING = gql`
  mutation updateListing($field: String, $value: String, $listingId: String) {
    updateListing(field: $field, value: $value, listingId: $listingId) {
      id
    }
  }
`;

const headCells = ["Note", "Listing", "Call", "Log", "Task", "Meet"];

const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $listingId: String
    $label: String
  ) {
    updateData(
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $listingId
      label: $label
    )
  }
`;

const GET_USERS = gql`
  query user {
    user {
      id
      first_name
      last_name
    }
  }
`;

export default function GridListingComponent({
  listings,
  refetch,
  listingId,
  gridNum,
}) {
  const [isEditMode, setIsEditMode] = React.useState({});
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);

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

  const setAllFalse = () => {
    setField(false);
    setFieldValue(false);
    setIsEditMode({});
    setEngaged(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== listings[0][field]) {
      updateListing({
        variables: {
          field: "listing." + field,
          value: fieldValue,
          listingId: listings[0]["id"],
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
        listingId: listingId,
        label: "Listing",
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
    updateListing,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(UPDATE_LISTING);

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

  const firstGridFields = fields.filter((field) => field.grid === gridNum);

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
        {listings.map((listing) => (
          <Card key={"card" + listing.id}>
            {gridNum === 1 ? (
              <>
                <CardContent>
                  <Avatar>***</Avatar>
                  <Typography gutterBottom variant="h5" component="h2">
                    {listing["name"] ? listing["name"] : "no name here yet"}
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
              </>
            ) : null}
            <CardContent>
              {firstGridFields.map(({ id, editable, label }) => (
                <FieldComponent
                  key={id}
                  id={id}
                  editable={editable}
                  title={label}
                  value={listing[id]}
                  editMode={isEditMode === id ? true : false}
                  setEditMode={setIsEditMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
              ))}
            </CardContent>
          </Card>
        ))}
      </Grid>
    </>
  );
}
