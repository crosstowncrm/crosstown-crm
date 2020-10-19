import React from "react";

import { IconButton, ListItemIcon } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import ClientMenus from "./search-account";
import PropertyMenus from "./search-property";
import ProfileMenus from "./search-profile";
import SalesMenus from "./search-sales";
import MarketingMenus from "./search-marketing";
import SupportMenus from "./search-support";
import { makeStyles } from "@material-ui/core/styles/index";

import { AppBar, Toolbar, Typography } from "@material-ui/core";

import {
  People as PeopleIcon,
  Rowing as RowingIcon,
  EmojiTransportation as EmojiTransportationIcon,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import CameraRollIcon from "@material-ui/icons/CameraRoll";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    paddingTop: 100,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
  },
  appBarImage: {
    maxHeight: "75px",
    paddingRight: "20px",
  },
}));

export default function CustomAppBar() {
  const [clientMenuEl, setClientMenuEl] = React.useState(false);
  const [propertyMenuEl, setPropertyMenuEl] = React.useState(null);
  const [profileMenuEl, setProfileMenuEl] = React.useState(null);
  const [salesMenuEl, setSalesMenuEl] = React.useState(null);
  const [marketingMenuEl, setMarketingMenuEl] = React.useState(null);
  const [supportMenuEl, setSupportMenuEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClientMenuOpen = (event) => {
    setClientMenuEl(event.currentTarget);
  };
  const handleClientMenuClose = () => {
    setClientMenuEl(null);
  };
  const isClientMenuOpen = Boolean(clientMenuEl);

  const handlePropertyMenuOpen = (event) => {
    setPropertyMenuEl(event.currentTarget);
  };
  const handlePropertyMenuClose = () => {
    setPropertyMenuEl(null);
  };
  const isPropertyMenuOpen = Boolean(propertyMenuEl);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuEl(null);
  };
  const isProfileMenuOpen = Boolean(profileMenuEl);

  const handleSalesMenuOpen = (event) => {
    setSalesMenuEl(event.currentTarget);
  };
  const handleSalesMenuClose = () => {
    setSalesMenuEl(null);
  };
  const isSalesMenuOpen = Boolean(salesMenuEl);

  const handleMarketingMenuOpen = (event) => {
    setMarketingMenuEl(event.currentTarget);
  };
  const handleMarketingMenuClose = () => {
    setMarketingMenuEl(null);
  };
  const isMarketingMenuOpen = Boolean(marketingMenuEl);

  const handleSupportMenuOpen = (event) => {
    setSupportMenuEl(event.currentTarget);
  };
  const handleSupportMenuClose = () => {
    setSupportMenuEl(null);
  };
  const isSupportMenuOpen = Boolean(supportMenuEl);

  const classes = useStyles();

  return (
    <>
      <ClientMenus
        anchorEl={clientMenuEl}
        isOpen={isClientMenuOpen}
        handleClose={handleClientMenuClose}
      ></ClientMenus>
      <PropertyMenus
        anchorEl={propertyMenuEl}
        isOpen={isPropertyMenuOpen}
        handleClose={handlePropertyMenuClose}
      ></PropertyMenus>
      <ProfileMenus
        anchorEl={profileMenuEl}
        isOpen={isProfileMenuOpen}
        handleClose={handleProfileMenuClose}
      ></ProfileMenus>
      <SalesMenus
        anchorEl={salesMenuEl}
        isOpen={isSalesMenuOpen}
        handleClose={handleSalesMenuClose}
      ></SalesMenus>
      <MarketingMenus
        anchorEl={marketingMenuEl}
        isOpen={isMarketingMenuOpen}
        handleClose={handleMarketingMenuClose}
      ></MarketingMenus>
      <SupportMenus
        anchorEl={supportMenuEl}
        isOpen={isSupportMenuOpen}
        handleClose={handleSupportMenuClose}
      ></SupportMenus>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            crosstown-crm
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleClientMenuOpen}
              color="inherit"
            >
              <PeopleIcon />
              Contacts
            </IconButton>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handlePropertyMenuOpen}
              color="inherit"
            >
              <EmojiTransportationIcon />
              Properties
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleSalesMenuOpen}
              color="inherit"
            >
              <AccessibilityNewIcon />
              Sales
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMarketingMenuOpen}
              color="inherit"
            >
              <CameraRollIcon />
              Marketing
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleSupportMenuOpen}
              color="inherit"
            >
              <RowingIcon />
              Support
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
              Profile
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={"area"} //
              aria-haspopup="true"
              onClick={handleClientMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
