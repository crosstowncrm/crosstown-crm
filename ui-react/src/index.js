import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import auth from "./auth/auth.js";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({});
import { createUploadLink } from "apollo-upload-client";
const uploadLink = createUploadLink({ uri: process.env.REACT_APP_GRAPHQL_URI });
const authLink = setContext((_, { headers, ...context }) => {
  const token = auth.getToken();

  return {
    headers: {
      // ...{
      //     'Content-Type': 'application/graphql',
      //     'Accept': 'application/graphql'
      // },
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...context,
  };
});

const client = new ApolloClient({
  cache: cache,
  link: authLink.concat(uploadLink),
});

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById("root"));
registerServiceWorker();
