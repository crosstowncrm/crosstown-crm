import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

import { Divider } from "@material-ui/core";
import { useMutation } from "@apollo/client";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_ROLE = gql`
  query roleQuery($id: ID) {
    getRole(id: $id) {
      id
      name
      assigned {
        id
        first_name
        last_name
      }
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation updateRole($field: String, $value: String, $roleId: String) {
    updateRole(field: $field, value: $value, roleId: $roleId) {
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

function RoleEdit(props) {
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

  const { loading, data, error, refetch } = useQuery(GET_ROLE, {
    variables: {
      id: params["uid"],
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!field && fieldValue !== data.getRole[0][field]) {
      updateRole({
        variables: {
          field: "role." + field,
          value: fieldValue,
          roleId: params["uid"],
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
    updateRole,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_ROLE, {
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
              {data.getRole.map(({ id, name }) => (
                <Card key={`card-${id}`}>
                  <CardContent>
                    <Avatar>***</Avatar>
                    <Typography gutterBottom variant="h5" component="h2">
                      {name ? name : "no data"}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="div"
                    >
                      {isEditMode["name"] ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            label="Name"
                            onClick={handleChange}
                            onChange={handleChange}
                            id="name"
                            defaultValue={name}
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
                              setIsEditMode({ name: true });
                              setEngaged(true);
                            } else setIsEditMode({ name: false });
                          }}
                        >
                          Name: {name}
                        </span>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
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
              Assigned
            </Grid>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              {data.getRole.map(({ id, assigned }) => (
                <Card key={`card-${id}`}>
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <span>
                        {assigned !== null
                          ? assigned.first_name + " " + assigned.last_name
                          : "no assigned"}
                      </span>
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default withStyles(styles)(RoleEdit);
