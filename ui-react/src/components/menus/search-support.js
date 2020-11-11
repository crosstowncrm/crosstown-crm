import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import BathtubIcon from "@material-ui/icons/Bathtub";
import EmojiNature from "@material-ui/icons/EmojiNature";

export default function SupportMenus({ isOpen, handleClose, anchorEl }) {
  const menuId = "support-menu";
  return (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isOpen}
      onClose={handleClose}
    >
      <Link to={"/"} onClick={handleClose}>
        <MenuItem primary={"Tickets"}>
          <ListItemIcon>
            <EmojiNature />
          </ListItemIcon>
          <p>Tickets</p>
        </MenuItem>
      </Link>
      <Link to={"/roles"} onClick={handleClose}>
        <MenuItem primary={"Roles"}>
          <ListItemIcon>
            <BathtubIcon />
          </ListItemIcon>
          <p>Roles</p>
        </MenuItem>
      </Link>
    </Menu>
  );
}
