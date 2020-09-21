import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import {
    ListAlt as ListAltIcon
} from "@material-ui/icons";

export default function MarketingMenus({
  isOpen,
  handleClose,
  anchorEl
}) {
  const menuId = "marketing-menu";
  return (
      <Menu
          anchorEl={anchorEl}
          id={menuId}
          keepMounted
          open={isOpen}
          onClose={handleClose}
      >
          <Link to={"/"} onClick={handleClose}>
              <MenuItem primary={"Email"}>
                  <ListItemIcon>
                      <AccountCircle />
                  </ListItemIcon>
                  <p>Email</p>
              </MenuItem>
          </Link>

          <Link to={"/"} onClick={handleClose}>
              <MenuItem primary={"Social"}>
                  <ListItemIcon>
                      <ListAltIcon />
                  </ListItemIcon>
                  <p>Social (TBD)</p>
              </MenuItem>
          </Link>

          <Link to={"/"} onClick={handleClose}>
              <MenuItem primary={"Content"}>
                  <ListItemIcon>
                      <ListAltIcon />
                  </ListItemIcon>
                  <p>Content</p>
              </MenuItem>
          </Link>

          <Link to={"/"} onClick={handleClose}>
              <MenuItem primary={"Ads"}>
                  <ListItemIcon>
                      <ListAltIcon />
                  </ListItemIcon>
                  <p>Ads (TBD)</p>
              </MenuItem>
          </Link>
      </Menu>
  );
}
