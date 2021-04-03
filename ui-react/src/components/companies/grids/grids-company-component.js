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

const UPDATE_COMPANY = gql`
  mutation updateCompany($field: String, $value: String, $companyId: String) {
    updateCompany(field: $field, value: $value, companyId: $companyId) {
      id
    }
  }
`;

const headCells = ["Note", "Email", "Call", "Log", "Task", "Meet"];

const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $companyId: String
    $label: String
  ) {
    updateData(
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $companyId
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

export default function GridCompanyComponent({
  companies,
  refetch,
  companyId,
}) {
  const [editNameMode, setEditNameMode] = React.useState(false);
  const [editOwnerMode, setEditOwnerMode] = React.useState(false);
  const [editPhoneMode, setEditPhoneMode] = React.useState(false);
  const [editCAMode, setEditCAMode] = React.useState(false);
  const [editDNMode, setEditDNMode] = React.useState(false);
  const [editWUMode, setEditWUMode] = React.useState(false);
  const [editDMode, setEditDMode] = React.useState(false);
  const [editLiMode, setEditLiMode] = React.useState(false);

  const [openDialogComponent, setOpenDialogComponent] = React.useState(false);
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);
  const [
    openDialogInterestComponent,
    setOpenInterestDialogComponent,
  ] = React.useState(false);
  const [
    openDialogListingComponent,
    setOpenListingDialogComponent,
  ] = React.useState(false);

  const callDialog = () => {
    setOpenDialogComponent(true);
  };

  const callAddressDialog = () => {
    setOpenAddressDialogComponent(true);
  };

  const callInterestDialog = () => {
    setOpenInterestDialogComponent(true);
  };

  const callListingDialog = () => {
    setOpenListingDialogComponent(true);
  };

  const handleCloseDialogComponent = () => {
    setOpenDialogComponent(false);
  };

  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };

  const handleCloseInterestDialogComponent = () => {
    setOpenInterestDialogComponent(false);
  };

  const handleCloseListingDialogComponent = () => {
    setOpenListingDialogComponent(false);
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
    setEditNameMode(false);
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
    if (!!field && fieldValue !== companies[0][field]) {
      updateCompany({
        variables: {
          field: "company." + field,
          value: fieldValue,
          companyId: companies[0]["id"],
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
        companyId: companyId,
        label: "Company",
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
    updateCompany,
    { loading: cncMutationLoading, error: cncQMutationError },
  ] = useMutation(UPDATE_COMPANY);

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
        {companies.map(
          ({
            name,
            id,
            created_at,
            domain_name,
            website_url,
            child_companies_num,
            li_page,
            lifecycle_stage,
            last_contacted,
            twitter_bio,
            last_seen,
            first_seen,
            year_founded,
            description,
            annual_revenue,
            industry,
            contacted_times,
            employees_num,
            last_activity,
            last_modified,
            li_bio,
            owner,
            owner_assigned_at,
            phone,
            address,
          }) => (
            <Card key={"card" + id}>
              <CardContent>
                <Avatar>***</Avatar>
                <Typography gutterBottom variant="h5" component="h2">
                  {name ? name : "no data"}
                </Typography>
              </CardContent>
              <CardActionArea>
                <CardActions>
                  {headCells.map((headCell) => (
                    <Link
                      to="/"
                      size="small"
                      color="primary"
                      key={`headcell-${headCell}`}
                    >
                      {headCell}
                    </Link>
                  ))}
                </CardActions>
              </CardActionArea>
              <Divider />

              <CardContent>
                <FieldComponent
                  title="Name"
                  value={name}
                  editMode={editNameMode}
                  setEditMode={setEditNameMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  {editCAMode ? (
                    <form onSubmit={handleSubmit}>
                      <TextField
                        type="date"
                        label="creared at"
                        onChange={handleChange}
                        id="created_at"
                        defaultValue={created_at.formatted}
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
                          setEditCAMode(!editCAMode);
                          setEngaged(true);
                        } else setEditCAMode(editCAMode);
                      }}
                    >
                      created at: {created_at.formatted}
                    </span>
                  )}
                </Typography>
                <FieldComponent
                  field="domain_name"
                  title="domain name"
                  value={domain_name}
                  editMode={editDNMode}
                  setEditMode={setEditDNMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
                <FieldComponent
                  title="website url"
                  field="website_url"
                  value={website_url}
                  editMode={editWUMode}
                  setEditMode={setEditWUMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <span>
                    {"child companies num"}: {child_companies_num}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <span>
                    {"last contacted"}: {last_contacted}
                  </span>
                </Typography>
                <FieldComponent
                  title="description"
                  value={description}
                  editMode={editDMode}
                  setEditMode={setEditDMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <span>
                    {"employees num"}: {employees_num}
                  </span>
                </Typography>
                <FieldComponent
                  title="li bio"
                  field="li_bio"
                  value={li_bio}
                  editMode={editLiMode}
                  setEditMode={setEditLiMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  {editOwnerMode ? (
                    <form name="User" onSubmit={handleAcSubmit}>
                      {users && !usersQueryLoading && !usersQueryError && (
                        <FormControl>
                          <Autocomplete
                            id="user"
                            name="user"
                            options={users.user}
                            getOptionLabel={(option) =>
                              option.first_name + " " + option.last_name
                            }
                            style={{ width: 250 }}
                            onChange={handleAcChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="User"
                                variant="outlined"
                                data-validators="isRequired"
                                required={true}
                              />
                            )}
                          />
                          <div style={{ fontSize: 12, color: "red" }}>
                            {/*{errors.clientError}*/}
                          </div>
                          <br />
                          <Button color="primary" type="submit">
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </FormControl>
                      )}
                    </form>
                  ) : (
                    <span
                      onDoubleClick={(event) => {
                        event.preventDefault();
                        if (!engaged) {
                          setEditOwnerMode(!editOwnerMode);
                          setEngaged(true);
                        } else setEditOwnerMode(editOwnerMode);
                      }}
                    >
                      owner:{" "}
                      {owner && owner.first_name
                        ? owner.first_name + " " + owner.last_name
                        : "no owner"}
                    </span>
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <span onDoubleClick={callAddressDialog}>
                    address:
                    {address !== null
                      ? " " +
                        address.postal_code +
                        " " +
                        address.street_address1 +
                        " " +
                        address.street_address2
                      : "no address yet"}
                  </span>
                </Typography>
                <FieldComponent
                  title="phone"
                  value={phone}
                  editMode={editPhoneMode}
                  setEditMode={setEditPhoneMode}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  engaged={engaged}
                  setEngaged={setEngaged}
                  handleCancel={handleCancel}
                ></FieldComponent>
              </CardContent>
            </Card>
          )
        )}
      </Grid>
      <ChangeAddressDialog
        key={"changeAddress"}
        isOpen={openAddressDialogComponent}
        handleClose={handleCloseAddressDialogComponent}
        unitId={companyId}
        title="Address"
        refetch={refetch}
        label="Company"
      ></ChangeAddressDialog>
    </>
  );
}
