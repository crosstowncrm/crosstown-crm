import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import auth from "./auth/auth.js";
import { InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
  possibleTypes: {
    Clients: ["Contact", "Company"],
  },
});

const token = auth.getToken();

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: cache,
  headers: {
    authorization: token ? "Bearer " + token : "",
  },
});

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById("root"));
registerServiceWorker();
