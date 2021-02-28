import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
export default function FieldComponent({
  title,
  field,
  value,
  editMode,
  handleSubmit,
  handleChange,
  engaged,
  setEditMode,
  setEngaged,
  handleCancel,
}) {
  return (
    <Typography variant="body2" color="textSecondary" component="div">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label={title}
            onClick={handleChange}
            onChange={handleChange}
            id={field ? field : title.toLowerCase()}
            defaultValue={value}
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
              setEditMode(!editMode);
              setEngaged(true);
            } else setEditMode(editMode);
          }}
        >
          {title}: {value}
        </span>
      )}
    </Typography>
  );
}
