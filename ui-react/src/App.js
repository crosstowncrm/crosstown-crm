import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  ListItemIcon
} from "@material-ui/core";

import {
  People as PeopleIcon,
  Rowing as RowingIcon,
  EmojiTransportation as EmojiTransportationIcon,
  ListAlt as ListAltIcon
} from "@material-ui/icons";

import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import CameraRollIcon from "@material-ui/icons/CameraRoll";
import BusinessIcon from "@material-ui/icons/Business";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import Login from "./components/Login";
import UserList from "./components/users/UserList";
import UserData from "./components/users/edit-user.component";
import UserCreate from "./components/users/create-user.component";
import ContactList from "./components/contacts/ContactList";
import ContactData from "./components/contacts/edit-contact.component";
import ContactCreate from "./components/contacts/create-contact.component";
import CompanyCreate from "./components/companies/create-company.component";
import CompanyList from "./components/companies/CompanyList";
import ClientList from "./components/clients/ClientList";
import CompanyData from "./components/companies/edit-company.component";
import PropertyList from "./components/properties/PropertyList";
import PropertyData from "./components/properties/edit-property.component";
import PropertyCreate from "./components/properties/create-property.component";
import ListingList from "./components/listings/ListingList";
import ListingData from "./components/listings/edit-listing.component";
import ArticleList from "./components/articles/ArticleList";
import PostList from "./components/posts/PostList";
import ArticleData from "./components/articles/edit-article.component";
import PostData from "./components/posts/edit-post.component";
import DealsList from "./components/deals/DealsList";
import DealData from "./components/deals/edit-deal.component";

import auth from "./auth/auth";
import { ProtectedRoute } from "./auth/protected.route";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    paddingTop: 100
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  },
  navLink: {
    textDecoration: "none",
    color: "inherit"
  },
  appBarImage: {
    maxHeight: "75px",
    paddingRight: "20px"
  }
}));

export default function App() {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [mobilePropertyEl, setMobilePropertyEl] = React.useState(null);
  const [mobileProfileEl, setMobileProfileEl] = React.useState(null);
  const [mobileSalesEl, setMobileSalesEl] = React.useState(null);
  const [mobileMarketingEl, setMobileMarketingEl] = React.useState(null);
  const [mobileSupportEl, setMobileSupportEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    auth.ereaseToken();
  };
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isMobilePropertyOpen = Boolean(mobilePropertyEl);
  const isMobileProfileOpen = Boolean(mobileProfileEl);

  const handleProfileMenuOpen = event => {
    setMobileProfileEl(event.currentTarget);
  };

  const isMobileSalesOpen = Boolean(mobileSalesEl);

  const handleSalesMenuOpen = event => {
    setMobileSalesEl(event.currentTarget);
  };

  const isMobileMarketingOpen = Boolean(mobileMarketingEl);

  const handleMarketingMenuOpen = event => {
    setMobileMarketingEl(event.currentTarget);
  };

  const isMobileSupportOpen = Boolean(mobileSupportEl);

  const handleSupportMenuOpen = event => {
    setMobileSupportEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobilePropertMenuClose = () => {
    setMobilePropertyEl(null);
  };

  const handleMobileProfileMenuClose = () => {
    setMobileProfileEl(null);
  };

  const handleMobileSalesMenuClose = () => {
    setMobileSalesEl(null);
  };
  const handleMobileMarketingMenuClose = () => {
    setMobileMarketingEl(null);
  };
  const handleMobileSupportMenuClose = () => {
    setMobileSupportEl(null);
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobilePropertyMenuOpen = event => {
    setMobilePropertyEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to={"/contacts"} onClick={handleMobileMenuClose}>
        <MenuItem primary={"Contacts"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Contacts</p>
        </MenuItem>
      </Link>
      <Link to={"/companies"} onClick={handleMobileMenuClose}>
        <MenuItem primary={"Companies"}>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <p>Companies</p>
        </MenuItem>
      </Link>
      <Link to={"/clients"} onClick={handleMobileMenuClose}>
        <MenuItem primary={"Clients"}>
          <ListItemIcon>
            <HowToRegIcon />
          </ListItemIcon>
          <p>Clients</p>
        </MenuItem>
      </Link>
      <Link to={"/users"} onClick={handleMobileMenuClose}>
        <MenuItem primary={"Users"}>
          <ListItemIcon>
            <DirectionsRunIcon />
          </ListItemIcon>
          <p>Users</p>
        </MenuItem>
      </Link>

      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Activity Feed</p>
      </MenuItem>
    </Menu>
  );
  const mobilePropertyMenuId = "primary-search-account-property-menu-mobile";
  const renderMobilePropertyMenu = (
    <Menu
      anchorEl={mobilePropertyEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobilePropertyMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobilePropertyOpen}
      onClose={handleMobilePropertMenuClose}
    >
      <Link to={"/properties"} onClick={handleMobilePropertMenuClose}>
        <MenuItem primary={"Properties"}>
          <ListItemIcon>
            <EmojiTransportationIcon />
          </ListItemIcon>
          <p>Properties</p>
        </MenuItem>
      </Link>

      <Link to={"/listings"} onClick={handleMobilePropertMenuClose}>
        <MenuItem primary={"Listings"}>
          <ListItemIcon>
            <Badge badgeContent={4} color="secondary">
              <ListAltIcon />
            </Badge>
          </ListItemIcon>
          <p>Listings</p>
        </MenuItem>
      </Link>
    </Menu>
  );
  const mobileProfileMenuId = "primary-search-account-profile-menu-mobile";
  const renderMobileProfileMenu = (
    <Menu
      anchorEl={mobileProfileEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileProfileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileProfileOpen}
      onClose={handleMobileProfileMenuClose}
    >
      <Link to={"/users/1"} onClick={handleMobileProfileMenuClose}>
        <MenuItem primary={"Profile"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Profile</p>
        </MenuItem>
      </Link>

      {auth.isAuth() ? (
        <Link to={"/login"} onClick={handleMobileProfileMenuClose}>
          <MenuItem primary={"Logout"} onClick={logout}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <p>Logout</p>
          </MenuItem>
        </Link>
      ) : (
        <Link to={"/login"} onClick={handleMobileProfileMenuClose}>
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
  const mobileSalesMenuId = "primary-search-account-sales-menu-mobile";
  const renderMobileSalesMenu = (
    <Menu
      anchorEl={mobileSalesEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileSalesMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileSalesOpen}
      onClose={handleMobileSalesMenuClose}
    >
      <Link to={"/deals"} onClick={handleMobileSalesMenuClose}>
        <MenuItem primary={"Deals"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Deals</p>
        </MenuItem>
      </Link>

      <Link to={"/"} onClick={handleMobileSalesMenuClose}>
        <MenuItem primary={"Tasks"}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Tasks</p>
        </MenuItem>
      </Link>

      <Link to={"/"}>
        <MenuItem primary={"Documents"} onClick={handleMobileSalesMenuClose}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Documents</p>
        </MenuItem>
      </Link>

      <Link to={"/"}>
        <MenuItem primary={"Workflows"} onClick={handleMobileSalesMenuClose}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Workflows (TBD)</p>
        </MenuItem>
      </Link>
    </Menu>
  );
  const mobileMarketingMenuId = "primary-search-account-marketing-menu-mobile";
  const renderMobileMarketingMenu = (
    <Menu
      anchorEl={mobileMarketingEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMarketingMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMarketingOpen}
      onClose={handleMobileMarketingMenuClose}
    >
      <Link to={"/"} onClick={handleMobileMarketingMenuClose}>
        <MenuItem primary={"Email"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Email</p>
        </MenuItem>
      </Link>

      <Link to={"/"} onClick={handleMobileMarketingMenuClose}>
        <MenuItem primary={"Social"}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Social (TBD)</p>
        </MenuItem>
      </Link>

      <Link to={"/"} onClick={handleMobileMarketingMenuClose}>
        <MenuItem primary={"Content"}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Content</p>
        </MenuItem>
      </Link>

      <Link to={"/"} onClick={handleMobileMarketingMenuClose}>
        <MenuItem primary={"Ads"}>
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <p>Ads (TBD)</p>
        </MenuItem>
      </Link>
    </Menu>
  );

  const mobileSupportMenuId = "primary-search-account-support-menu-mobile";
  const renderMobileSupportMenu = (
    <Menu
      anchorEl={mobileSupportEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileSupportMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileSupportOpen}
      onClose={handleMobileSupportMenuClose}
    >
      <Link to={"/"} onClick={handleMobileSupportMenuClose}>
        <MenuItem primary={"Tickets"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <p>Tickets</p>
        </MenuItem>
      </Link>
    </Menu>
  );

  return (
    <Router>
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
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
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <PeopleIcon />
                  Contacts
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleMobilePropertyMenuOpen}
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
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMobilePropertyMenu}
          {renderMobileProfileMenu}
          {renderMobileSalesMenu}
          {renderMobileMarketingMenu}
          {renderMobileSupportMenu}
          <main className={classes.content}>
            <Switch>
              <ProtectedRoute exact path="/" component={PropertyList} />
              <ProtectedRoute exact path="/users" component={UserList} />
              <ProtectedRoute exact path="/users/:uid" component={UserData} />
              <ProtectedRoute exact path="/contacts" component={ContactList} />
              <ProtectedRoute
                exact
                path="/contacts/:uid"
                component={ContactData}
              />
              <ProtectedRoute
                exact
                path="/contact/create"
                component={ContactCreate}
              />
              <ProtectedRoute
                exact
                path="/user/create"
                component={UserCreate}
              />
              <ProtectedRoute
                  exact
                  path="/company/create"
                  component={CompanyCreate}
              />
              <ProtectedRoute exact path="/clients" component={ClientList} />
              <ProtectedRoute exact path="/companies" component={CompanyList} />
              <ProtectedRoute
                exact
                path="/companies/:uid"
                component={CompanyData}
              />
              <ProtectedRoute
                exact
                path="/properties"
                component={PropertyList}
              />
              <ProtectedRoute
                exact
                path="/properties/:uid"
                component={PropertyData}
              />
              <ProtectedRoute
                  exact
                  path="/property/create"
                  component={PropertyCreate}
              />
              <ProtectedRoute exact path="/listings" component={ListingList} />
              <ProtectedRoute
                exact
                path="/listings/:uid"
                component={ListingData}
              />
              <ProtectedRoute exact path="/articles" component={ArticleList} />
              <ProtectedRoute
                exact
                path="/articles/:uid"
                component={ArticleData}
              />
              <ProtectedRoute exact path="/posts" component={PostList} />
              <ProtectedRoute exact path="/posts/:uid" component={PostData} />
              <ProtectedRoute exact path="/deals" component={DealsList} />
              <ProtectedRoute exact path="/deals/:uid" component={DealData} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    </Router>
  );
}
