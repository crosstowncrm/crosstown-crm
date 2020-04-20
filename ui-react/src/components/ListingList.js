import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Paper,
    TableSortLabel,
    Typography,
} from "@material-ui/core";

const styles = theme => ({
    root: {
        maxWidth: 700,
        marginTop: theme.spacing(3),
        overflowX: "auto",
        margin: "auto"
    },
    table: {
        minWidth: 700
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 300
    }
});

const GET_LISTING = gql`
    query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_ListingOrdering]
    ) {
        Listing(first: $first, offset: $offset, orderBy: $orderBy) {
            id
            name
            #      avgStars
            #      numReviews
        }
    }
`;

function ListingList(props) {
    const { classes } = props;
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("name");

    const { loading, data, error } = useQuery(GET_LISTING, {
        variables: {
            orderBy: orderBy + "_" + order
        }
    });

    const handleSortRequest = property => {
        const newOrderBy = property;
        let newOrder = "desc";

        if (orderBy === property && order === "desc") {
            newOrder = "asc";
        }

        setOrder(newOrder);
        setOrderBy(newOrderBy);
    };

    return (
        <Paper className={classes.root}>
            <Typography variant="h2" gutterBottom>
                Listing List
            </Typography>
            {loading && !error && <p>Loading...</p>}
            {error && !loading && <p>Error</p>}

            {data && !loading && !error && (
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key="name"
                                sortDirection={orderBy === "name" ? order : false}
                            >
                                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={order}
                                        onClick={() => handleSortRequest("name")}
                                    >
                                        name
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.Listing.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell>
                                        <Link className="edit-link" to={"/listings/" + n.id}>
                                            {n.name}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
}

export default withStyles(styles)(ListingList);
