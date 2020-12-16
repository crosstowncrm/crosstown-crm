import React from "react";

import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import multiStep from "../../../multiStep/multiStep";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useQuery, gql } from "@apollo/client";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
  },
});

const GET_ROLES = gql`
  query userQuery {
    Role {
      id
      name
    }
  }
`;

function ContactRole() {
  const [errors, setErrors] = React.useState(multiStep.getErrors()["role"]);

  const handleChange = (event, value) => {
    multiStep.saveData({
      name: "role",
      value: { name: value.name },
    });
    multiStep.errorRemove("role");
    setErrors({ ...errors, [role]: "" });
  };
  const { loading: rolesLoading, data: roles, error } = useQuery(GET_ROLES, {
    variables: {
      orderBy: "name_asc",
    },
  });

  const { role } = multiStep.getData();
  return (
    <div>
      <div className="row">
        <div className="six columns">
          {rolesLoading && !error && <p>Loading...</p>}
          {error && !rolesLoading && <p>Error</p>}

          {roles && !rolesLoading && !error && (
            <Autocomplete
              id="role"
              name="role"
              options={roles.Role}
              getOptionLabel={(option) => option.name}
              style={{ width: 250 }}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  variant="outlined"
                  data-validators="isRequired"
                  required={true}
                />
              )}
            />
          )}

          <div style={{ fontSize: 12, color: "red" }}>
            {/*{errors.clientRole}*/}
          </div>
        </div>
      </div>
    </div>
  );
}
export default withStyles(styles)(ContactRole);
