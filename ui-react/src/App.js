import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
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
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon
} from "@material-ui/icons";

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

import classNames from "classnames";
import gql from "graphql-tag";

const drawerWidth = 240;

const styles = theme => ({
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
    }),
    backgroundColor: "#383838"
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
    marginLeft: 12,
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
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto"
  }
});

const LOGIN = gql`
    mutation login($name: String!, $pswd: String!) {
        login(email: $name, password: $pswd) {
            id
        }
    }
`;

function login(){
    console.log('login');
}

function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let userId = localStorage.getItem('userId');
    console.log('userId', userId);
    return userId !== null;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "Home",
      open: true
    };
  }

  render() {
    const { classes } = this.props;

    const id = localStorage.getItem("uid")
    return (
      <Router>
        <React.Fragment>
          <CssBaseline />
          <div className={classes.root}>
            <AppBar
              position="absolute"
              className={classNames(
                classes.appBar,
                this.state.open && classes.appBarShift
              )}
            >
              <Toolbar
                disableGutters={!this.state.open}
                className={classes.toolbar}
              >
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(
                    classes.menuButton,
                    this.state.open && classes.menuButtonHidden
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h2"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  Welcome
                </Typography>
                  {!isAuthenticated() ? (
                      <div>

                          <Button>
                              <Link className="edit-link" to={"/login"}>
                                  <ListItemText primary="Login" />
                              </Link>
                          </Button>

                      </div>

                  ): (
                      <div>

                          <Button
                              className={'logout-action'}
                              onClick={()=>{
                                localStorage.clear();
                                window.location.href = 'login'
                              }}
                          >
                              Logout
                          </Button>
                      </div>
                  )}


              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: classNames(
                  classes.drawerPaper,
                  !this.state.open && classes.drawerPaperClose
                )
              }}
              open={this.state.open}
            >
              <div className={classes.toolbarIcon}>
                <IconButton>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <List>
                <div>
                  <ListItem button>
                    <ListItemIcon>
                      <EventNoteIcon />
                    </ListItemIcon>
                    <Link className="edit-link" to={"/contacts"}>
                      <ListItemText primary="Contacts" />
                    </Link>
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <Link className="edit-link" to={"/users"}>
                      <ListItemText primary="Users" />
                    </Link>
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <Link className="edit-link" to={"/companies"}>
                      <ListItemText primary="Companies" />
                    </Link>
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <Link className="edit-link" to={"/properties"}>
                      <ListItemText primary="Properties" />
                    </Link>
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <Link className="edit-link" to={"/listings"}>
                      <ListItemText primary="Listings" />
                    </Link>
                  </ListItem>

                  <ListItem button>
                     <ListItemIcon>
                       <PeopleIcon />
                     </ListItemIcon>
                     <Link className="edit-link" to={"/articles"}>
                       <ListItemText primary="Articles" />
                     </Link>
                  </ListItem>

                  <ListItem button>
                      <ListItemIcon>
                          <PeopleIcon />
                      </ListItemIcon>
                      <Link className="edit-link" to={"/posts"}>
                          <ListItemText primary="Posts" />
                      </Link>
                  </ListItem>

                </div>
              </List>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />

                  {!isAuthenticated() ? (
                      <Switch>
                          <Route exact path="/login" component={Login} />
                          <Route exact path="/error" component={Error} />
                      </Switch>

                  ): (
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
                  )}

            </main>
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
