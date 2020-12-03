import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import auth from "./auth/auth.js";
import { InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({});
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: cache,
  request: (operation) => {
      operation.setContext({
          headers: {
              authorization: auth.getToken(),
          },
      });
  },
});

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById("root"));
registerServiceWorker();
