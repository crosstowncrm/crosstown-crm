import React from "react";
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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
  Button,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import {
  ChevronLeft as ChevronLeftIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Rowing as RowingIcon,
  EmojiTransportation as EmojiTransportationIcon,
  ListAlt as ListAltIcon,
  TextFormat as TextFormatIcon,
  Telegram as TelegramIcon

} from "@material-ui/icons";

import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import CameraRollIcon from '@material-ui/icons/CameraRoll';
import AcUnitIcon from '@material-ui/icons/AcUnit';


import Login from "./components/Login";
import Error from "./components/Error";
import UserList from "./components/UserList";
import UserData from "./components/edit-user.component";
import ContactList from "./components/ContactList";
import ContactData from "./components/edit-contact.component";
import CompanyList from "./components/CompanyList";
import CompanyData from "./components/edit-company.component";
import PropertyList from "./components/PropertyList";
import PropertyData from "./components/edit-property.component";
import ListingList from "./components/ListingList";
import ListingData from "./components/edit-listing.component";
import ArticleList from "./components/ArticleList";
import PostList from "./components/PostList";
import ArticleData from "./components/edit-article.component";
import PostData from "./components/edit-post.component";

const drawerWidth = 240;

function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let userId = localStorage.getItem('userId');
    return userId !== null;
}


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        paddingTop: 100,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    navLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    appBarImage: {
        maxHeight: '75px',
        paddingRight: '20px',
    },
}));

export default function App() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [mobilePropertyEl, setMobilePropertyEl] = React.useState(null);
    const [mobileProfileEl, setMobileProfileEl] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const isMobilePropertyOpen = Boolean(mobilePropertyEl);

    const isMobileProfileOpen = Boolean(mobileProfileEl);

    const handleProfileMenuOpen = (event) => {
        setMobileProfileEl(event.currentTarget);
    };

    const handlePropertyMenuOpen = (event) => {
        setMobilePropertyEl(event.currentTarget);
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


    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const handlePropertyMenuClose = () => {
        setMobilePropertyEl(null);
        handleMobilePropertMenuClose();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobilePropertyMenuOpen = (event) => {
        setMobilePropertyEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Contacts</MenuItem>
            <MenuItem onClick={handleMenuClose}>Companies</MenuItem>
            <MenuItem onClick={handleMenuClose}>Activity Feed</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AcUnitIcon />
                </IconButton>
                <p>Close</p>
            </MenuItem>
            <Link to={"/contacts"}>
                <MenuItem primary={"Contacts"}>

                        <ListItemIcon>
                        <AccountCircle />
                        </ListItemIcon>
                        <p>Contacts</p>

                </MenuItem>
            </Link>
            <Link to={"/companies"}>
                <MenuItem primary={"Companies"}>

                    <ListItemIcon>
                        <BusinessIcon />
                    </ListItemIcon>
                    <p>Companies</p>

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
    const mobilePropertyMenuId = 'primary-search-account-property-menu-mobile';
    const renderMobilePropertyMenu = (
        <Menu
            anchorEl={mobilePropertyEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobilePropertyMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobilePropertyOpen}
            onClose={handleMobilePropertMenuClose}
        >


            <Link to={"/properties"}>
                <MenuItem primary={"Properties"}>

                    <ListItemIcon>
                        <EmojiTransportationIcon />
                    </ListItemIcon>
                    <p>Properties</p>

                </MenuItem>
            </Link>

            <Link to={"/listings"}>
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
    const mobileProfileMenuId = 'primary-search-account-profile-menu-mobile';
    const renderMobileProfileMenu = (
        <Menu
            anchorEl={mobileProfileEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileProfileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileProfileOpen}
            onClose={handleMobileProfileMenuClose}
        >


            <Link to={"/users/1"}>
                <MenuItem primary={"Properties"}>

                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <p>Profile</p>

                </MenuItem>
            </Link>

            <Link to={"/login"}>
                <MenuItem primary={"Listings"}>

                    <ListItemIcon>
                            <ListAltIcon />
                    </ListItemIcon>
                    <p>Login</p>

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
                          aria-label="open drawer"
                          edge="start"
                          onClick={handleDrawerToggle}
                          className={classes.menuButton}
                      >
                          <MenuIcon />
                      </IconButton>
                      {/*<img*/}
                      {/*className={classes.appBarImage}*/}
                      {/*src="img/grandstack.png"*/}
                      {/*alt="GRANDstack logo"*/}
                      {/*/>*/}
                      <Typography className={classes.title} variant="h6" noWrap
                      >crosstown-crm
                      </Typography>
                      <div className={classes.grow} />
                      <div className={classes.sectionDesktop}>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleMobileMenuOpen}
                              color="inherit"
                          >
                              <PeopleIcon />Contacts
                          </IconButton>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleMobilePropertyMenuOpen}
                              color="inherit"
                          >
                              <EmojiTransportationIcon />Properties
                          </IconButton>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleProfileMenuOpen}
                              color="inherit"
                          >
                              <AccessibilityNewIcon />Sales
                          </IconButton>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleProfileMenuOpen}
                              color="inherit"
                          >
                              <CameraRollIcon />Marketing
                          </IconButton>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleProfileMenuOpen}
                              color="inherit"
                          >
                              <RowingIcon />Support
                          </IconButton>
                          <IconButton
                              edge="end"
                              aria-label="account of current user"
                              aria-controls={menuId}
                              aria-haspopup="true"
                              onClick={handleProfileMenuOpen}
                              color="inherit"
                          >
                              <AccountCircle />Profile
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
            {renderMenu}
            {renderMobilePropertyMenu}
              {renderMobileProfileMenu}
          <main className={classes.content} >
              <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/users" component={UserList} />
                  <Route exact path="/users/:uid" component={UserData} />
                  <Route exact path="/contacts" component={ContactList} />
                  <Route exact path="/contacts/:uid" component={ContactData} />
                  <Route exact path="/companies" component={CompanyList} />
                  <Route exact path="/companies/:uid" component={CompanyData} />
                  <Route exact path="/properties" component={PropertyList} />
                  <Route exact path="/properties/:uid" component={PropertyData} />
                  <Route exact path="/listings" component={ListingList} />
                  <Route exact path="/listings/:uid" component={ListingData} />
                  <Route exact path="/articles" component={ArticleList} />
                  <Route exact path="/articles/:uid" component={ArticleData} />
                  <Route exact path="/posts" component={PostList} />
                  <Route exact path="/posts/:uid" component={PostData} />
              </Switch>
          </main>
          </div>
        </React.Fragment>
      </Router>
    );
}

