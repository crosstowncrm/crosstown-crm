import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { ListItemIcon } from "@material-ui/core";
import {
    ListAlt as ListAltIcon
} from "@material-ui/icons";
import AccountCircle from "@material-ui/icons/AccountCircle";

import auth from "../../auth/auth";

export default function ProfileMenus({
  isOpen,
  handleClose,
  anchorEl
}) {
  const logout = () => {
    auth.ereaseToken();
  };
  const menuId = "profile-menu";
  return (
      <Menu
          anchorEl={anchorEl}
          id={menuId}
          keepMounted
          open={isOpen}
          onClose={handleClose}
      >
          <Link to={"/users/1"} onClick={handleClose}>
              <MenuItem primary={"Profile"}>
                  <ListItemIcon>
                      <AccountCircle />
                  </ListItemIcon>
                  <p>Profile</p>
              </MenuItem>
          </Link>

          {auth.isAuth() ? (
              <Link to={"/login"} onClick={handleClose}>
                  <MenuItem primary={"Logout"} onClick={logout}>
                      <ListItemIcon>
                          <ListAltIcon />
                      </ListItemIcon>
                      <p>Logout</p>
                  </MenuItem>
              </Link>
          ) : (
              <Link to={"/login"} onClick={handleClose}>
                  <MenuItem primary={"Login"}>
                      <ListItemIcon>
                          <ListAltIcon />
                      </ListItemIcon>
                      <p>Login</p>
                  </MenuItem>
              </Link>
          )}
      </Menu>
  );
}
