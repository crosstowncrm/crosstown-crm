import React from "react";

const auth = () => {
  const getToken = () => {
    console.log("asked for token");
    return localStorage.getItem("inMemoryJWT");
  };

  const setToken = (token) => {
    console.log("token was set");
    localStorage.setItem("inMemoryJWT", token);
    return true;
  };

  const ereaseToken = () => {
    localStorage.removeItem("inMemoryJWT");
    return true;
  };

  const isAuth = () => {
    let inMemoryJWT = localStorage.getItem("inMemoryJWT");
    return inMemoryJWT !== "null" && inMemoryJWT !== null ? true : false;
  };

  return {
    setToken,
    getToken,
    ereaseToken,
    isAuth,
  };
};

export default auth();
