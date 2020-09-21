import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

export default function SupportMenus({
  isOpen,
  handleClose,
  anchorEl
}) {
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
                      <AccountCircle />
                  </ListItemIcon>
                  <p>Tickets</p>
              </MenuItem>
          </Link>
      </Menu>
  );
}
