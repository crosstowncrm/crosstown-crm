import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import CustomAppBar from "./components/menus/custom-appbar";

import ActivityList from "./components/activities/ActivityList";
import ArticleCreate from "./components/articles/create-article.component";
import ArticleData from "./components/articles/edit-article.component";
import ArticleList from "./components/articles/ArticleList";
import ClientList from "./components/clients/ClientList";

import DocumentCreate from "./components/documents/create-document.component";
import DocumentData from "./components/documents/edit-document.component";
import DocumentList from "./components/documents/DocumentList";

import CompanyCreate from "./components/companies/create-company.component";
import CompanyData from "./components/companies/edit-company.component";
import CompanyList from "./components/companies/CompanyList";
import ContactCreate from "./components/contacts/create-contact.component";
import ContactData from "./components/contacts/edit-contact.component";
import ContactList from "./components/contacts/ContactList";
import DealData from "./components/deals/edit-deal.component";
import DealsList from "./components/deals/DealsList";
import EmailCreate from "./components/emails/create-email.component";
import EmailData from "./components/emails/edit-email.component";
import EmailsList from "./components/emails/EmailList";
import ListingData from "./components/listings/edit-listing.component";
import ListingList from "./components/listings/ListingList";
import Login from "./components/Login";
import PostData from "./components/posts/edit-post.component";
import PostList from "./components/posts/PostList";
import PropertyCreate from "./components/properties/create-property.component";
import PropertyData from "./components/properties/edit-property.component";
import PropertyList from "./components/properties/PropertyList";
import RoleCreate from "./components/roles/create-role.component";
import RoleData from "./components/roles/edit-role.component";
import RoleList from "./components/roles/RoleList";
import TaskCreate from "./components/tasks/create-task.component";
import TaskData from "./components/tasks/edit-task.component";
import TaskList from "./components/tasks/TaskList";
import UserCreate from "./components/users/create-user.component";
import UserData from "./components/users/edit-user.component";
import UserList from "./components/users/UserList";
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
              <ProtectedRoute exact path="/roles" component={RoleList} />
              <ProtectedRoute exact path="/roles/:uid" component={RoleData} />
              <ProtectedRoute
                exact
                path="/role/create"
                component={RoleCreate}
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
              <ProtectedRoute
                exact
                path="/document/create"
                component={DocumentCreate}
              />
              <ProtectedRoute
                exact
                path="/article/create"
                component={ArticleCreate}
              />
              <ProtectedRoute exact path="/clients" component={ClientList} />
              <ProtectedRoute exact path="/activity" component={ActivityList} />
              <ProtectedRoute exact path="/companies" component={CompanyList} />
              <ProtectedRoute exact path="/docs" component={DocumentList} />
              <ProtectedRoute
                exact
                path="/companies/:uid"
                component={CompanyData}
              />
              <ProtectedRoute
                exact
                path="/documents/:uid"
                component={DocumentData}
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
              <ProtectedRoute
                exact
                path="/email/create"
                component={EmailCreate}
              />
              <ProtectedRoute exact path="/emails" component={EmailsList} />
              <ProtectedRoute exact path="/emails/:uid" component={EmailData} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    </Router>
  );
}
