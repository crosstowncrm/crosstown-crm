import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import {
    EmojiTransportation as EmojiTransportationIcon,
    ListAlt as ListAltIcon
} from "@material-ui/icons";

export default function PropertyMenus({
  isOpen,
  handleClose,
  anchorEl
}) {
  const menuId = "account-menu";
  return (
      <Menu
          anchorEl={anchorEl}
          id={menuId}
          keepMounted
          open={isOpen}
          onClose={handleClose}
      >
          <Link to={"/properties"} onClick={handleClose}>
              <MenuItem primary={"Properties"}>
                  <ListItemIcon>
                      <EmojiTransportationIcon />
                  </ListItemIcon>
                  <p>Properties</p>
              </MenuItem>
          </Link>

          <Link to={"/listings"} onClick={handleClose}>
              <MenuItem primary={"Listings"}>
                  <ListItemIcon>
                      <ListAltIcon />
                  </ListItemIcon>
                  <p>Listings</p>
              </MenuItem>
          </Link>
      </Menu>
  );
}
