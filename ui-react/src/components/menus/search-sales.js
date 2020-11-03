import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";

import { ListAlt as ListAltIcon } from "@material-ui/icons";

export default function SalesMenus({ isOpen, handleClose, anchorEl }) {
  const menuId = "sales-menu";
  return (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isOpen}
      onClose={handleClose}
    >
      <Link to={"/deals"} onClick={handleClose}>
        <MenuItem primary={"Deals"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Deals</p>
        </MenuItem>
      </Link>

      <Link to={"/tasks"} onClick={handleClose}>
        <MenuItem primary={"Tasks"}>
          <ListItemIcon>
            <CloudCircleIcon />
          </ListItemIcon>
          <p>Taskssss</p>
        </MenuItem>
      </Link>

      <Link to={"/docs"}>
        <MenuItem primary={"Documents"} onClick={handleClose}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Documents</p>
        </MenuItem>
      </Link>

      <Link to={"/wflows"}>
        <MenuItem primary={"Workflows"} onClick={handleClose}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Workflows (TBD)</p>
        </MenuItem>
      </Link>
    </Menu>
  );
}
