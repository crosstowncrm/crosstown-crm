import React from "react";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import BusinessIcon from "@material-ui/icons/Business";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';

export default function ClientMenus({
  isOpen,
  handleClose,
  anchorEl
}) {
  const menuId = "account-menu";
  return (
      <Menu
          anchorEl={anchorEl}
          id={menuId}
          open={isOpen}
          onClose={handleClose}
          keepMounted
      >
          <Link to={"/contacts"} onClick={handleClose}>
              <MenuItem primary={"Contacts"}>
                  <ListItemIcon>
                      <AccountCircle />
                  </ListItemIcon>
                  <p>Contacts</p>
              </MenuItem>
          </Link>
          <Link to={"/companies"} onClick={handleClose}>
              <MenuItem primary={"Companies"}>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <p>Companies</p>
              </MenuItem>
          </Link>
          <Link to={"/clients"} onClick={handleClose}>
              <MenuItem primary={"Clients"}>
                  <ListItemIcon>
                      <HowToRegIcon />
                  </ListItemIcon>
                  <p>Clients</p>
              </MenuItem>
          </Link>
          <Link to={"/users"} onClick={handleClose}>
              <MenuItem primary={"Users"}>
                  <ListItemIcon>
                      <DirectionsRunIcon />
                  </ListItemIcon>
                  <p>Users</p>
              </MenuItem>
          </Link>
          <Link to={"/activity"} onClick={handleClose}>
              <MenuItem>
                  <IconButton>
                      <TransferWithinAStationIcon />
                  </IconButton>
                  <p>Activity Feed</p>
              </MenuItem>
          </Link>
      </Menu>
  );
}
