import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

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
      <Link to={"/deals"} onClick={handleClose}>
        <MenuItem primary={"Deals"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Deals</p>
        </MenuItem>
      </Link>
      <Link to={"/deals"} onClick={handleClose}>
        <MenuItem primary={"Deals"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Deals</p>
        </MenuItem>
      </Link>

      <Link to={"/"} onClick={handleClose}>
        <MenuItem primary={"Tasks"}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Tasks</p>
        </MenuItem>
      </Link>

      <Link to={"/"}>
        <MenuItem primary={"Documents"} onClick={handleClose}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Documents</p>
        </MenuItem>
      </Link>

      <Link to={"/"}>
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
