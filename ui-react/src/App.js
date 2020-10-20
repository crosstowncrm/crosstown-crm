import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import CustomAppBar from "./components/menus/custom-appbar";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import Login from "./components/Login";
import UserList from "./components/users/UserList";
import UserData from "./components/users/edit-user.component";
import UserCreate from "./components/users/create-user.component";
import ContactList from "./components/contacts/ContactList";
import ContactData from "./components/contacts/edit-contact.component";
import ContactCreate from "./components/contacts/create-contact.component";

import TaskList from "./components/tasks/TaskList";
import TaskData from "./components/tasks/edit-task.component";
import TaskCreate from "./components/tasks/create-task.component";

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

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    paddingTop: 100,
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Router>
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <CustomAppBar></CustomAppBar>
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
              <ProtectedRoute exact path="/tasks" component={TaskList} />
              <ProtectedRoute exact path="/tasks/:uid" component={TaskData} />
              <ProtectedRoute
                exact
                path="/task/create"
                component={TaskCreate}
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
