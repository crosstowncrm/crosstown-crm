import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ClientMenus from "./components/menus/search-account";
import PropertyMenus from "./components/menus/search-property";
import ProfileMenus from "./components/menus/search-profile";
import SalesMenus from "./components/menus/search-sales";
import MarketingMenus from "./components/menus/search-marketing";
import SupportMenus from "./components/menus/search-support";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline} from "@material-ui/core";

import {
  People as PeopleIcon,
  Rowing as RowingIcon,
  EmojiTransportation as EmojiTransportationIcon,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import CameraRollIcon from "@material-ui/icons/CameraRoll";

import Login from "./components/Login";
import UserList from "./components/users/UserList";
import UserData from "./components/users/edit-user.component";
import UserCreate from "./components/users/create-user.component";
import ContactList from "./components/contacts/ContactList";
import ContactData from "./components/contacts/edit-contact.component";
import ContactCreate from "./components/contacts/create-contact.component";
import CompanyCreate from "./components/companies/create-company.component";
import CompanyList from "./components/companies/CompanyList";
import ActivityList from "./components/activities/ActivityList";
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
import { ProtectedRoute } from "./auth/protected.route";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24
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

  const handleClientMenuOpen = event => {
      setClientMenuEl(event.currentTarget);
  };
  const handleClientMenuClose = () => {
      setClientMenuEl(null);
  };
  const isClientMenuOpen = Boolean(clientMenuEl);

  const handlePropertyMenuOpen = event => {
      setPropertyMenuEl(event.currentTarget);
  };
  const handlePropertyMenuClose = () => {
      setPropertyMenuEl(null);
  };
  const isPropertyMenuOpen = Boolean(propertyMenuEl);

  const handleProfileMenuOpen = event => {
      setProfileMenuEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
      setProfileMenuEl(null);
  };
  const isProfileMenuOpen = Boolean(profileMenuEl);

  const handleSalesMenuOpen = event => {
      setSalesMenuEl(event.currentTarget);
  };
  const handleSalesMenuClose = () => {
      setSalesMenuEl(null);
  };
  const isSalesMenuOpen = Boolean(salesMenuEl);

  const handleMarketingMenuOpen = event => {
      setMarketingMenuEl(event.currentTarget);
  };
  const handleMarketingMenuClose = () => {
      setMarketingMenuEl(null);
  };
  const isMarketingMenuOpen = Boolean(marketingMenuEl);

  const handleSupportMenuOpen = event => {
      setSupportMenuEl(event.currentTarget);
  };
  const handleSupportMenuClose = () => {
      setSupportMenuEl(null);
  };
  const isSupportMenuOpen = Boolean(supportMenuEl);

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
                  aria-controls={"area"}//
                  aria-haspopup="true"
                  onClick={handleClientMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          <ClientMenus
            anchorEl={clientMenuEl}
            isOpen={isClientMenuOpen}
            handleClose={handleClientMenuClose}
          >
          </ClientMenus>
          <PropertyMenus
              anchorEl={propertyMenuEl}
              isOpen={isPropertyMenuOpen}
              handleClose={handlePropertyMenuClose}
          >
          </PropertyMenus>
          <ProfileMenus
              anchorEl={profileMenuEl}
              isOpen={isProfileMenuOpen}
              handleClose={handleProfileMenuClose}
          >
          </ProfileMenus>
          <SalesMenus
              anchorEl={salesMenuEl}
              isOpen={isSalesMenuOpen}
              handleClose={handleSalesMenuClose}
          >
          </SalesMenus>
          <MarketingMenus
              anchorEl={marketingMenuEl}
              isOpen={isMarketingMenuOpen}
              handleClose={handleMarketingMenuClose}
          >
          </MarketingMenus>
          <SupportMenus
              anchorEl={supportMenuEl}
              isOpen={isSupportMenuOpen}
              handleClose={handleSupportMenuClose}
          >
          </SupportMenus>

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
              <ProtectedRoute exact path="/activity" component={ActivityList} />
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
