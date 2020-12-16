import React from "react";
import { useQuery, gql } from "@apollo/client";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import GridNameComponent from "./grids/grids-name-component";
import GridPropertyComponent from "./grids/grids-property-component";
import { CardHeader, Divider } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    maxWidth: 700,
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
});

const GET_PROPERTY = gql`
  query property($id: ID) {
    Property(id: $id) {
      id
      name
      created_at {
        formatted
      }
      property_type
      address {
        id
        postal_code
        street_address1
        street_address2
      }
      contacts {
        id
        first_name
        last_name
      }
      companies {
        id
        name
      }
      phone
    }
  }
`;

const PropertyEdit = (props) => {
  const { classes } = props;
  const params = props.match.params;
  const [
    openAddressDialogComponent,
    setOpenAddressDialogComponent,
  ] = React.useState(false);
  const handleCloseAddressDialogComponent = () => {
    setOpenAddressDialogComponent(false);
  };
  const callAddressDialog = () => {
    setOpenAddressDialogComponent(true);
  };

  const { loading, data, error, refetch } = useQuery(GET_PROPERTY, {
    variables: {
      id: params["uid"],
    },
  });

  return (
    <>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={3}
          style={{
            border: "3px solid blue",
            margin: "12px",
            width: "98%",
          }}
        >
          <Grid item md={3}>
            <GridNameComponent title={"About"}></GridNameComponent>
            <GridPropertyComponent
              properties={data.Property}
              refetch={refetch}
              propertyId={params["uid"]}
            ></GridPropertyComponent>
          </Grid>
          <Grid item md={6}>
            <GridNameComponent title={"Activity"}></GridNameComponent>
          </Grid>
          <Grid item md={3}>
            <GridNameComponent title={"Associations"}></GridNameComponent>
            <Grid
              item
              md={12}
              style={{
                border: "2px solid blue",
                margin: "2px",
              }}
            >
              <Card key={`card`}>
                <CardHeader title="Contact" />
                <Divider />
                {data.Property.map(({ contacts }) =>
                  contacts.map(({ id, first_name, last_name }) => (
                    <CardContent key={`cd_${id}`}>
                      <Typography key={`tp_${id}`}>
                        <Link
                          key={`link${id}`}
                          className="edit-link"
                          to={`/contacts/${id}`}
                        >
                          {first_name} {last_name}
                        </Link>
                      </Typography>
                    </CardContent>
                  ))
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default withStyles(styles)(PropertyEdit);
