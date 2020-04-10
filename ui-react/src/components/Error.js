import React from "react";

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

function Error (props) {
   return (
        <div className="Navigation-search">
            Hmm, something went wrong
        </div>
    );
}

export default (Error);
