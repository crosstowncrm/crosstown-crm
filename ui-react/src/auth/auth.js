import React from "react";

const auth = () => {
  const getToken = () => {
    return localStorage.getItem("inMemoryJWT");
  };

  const setToken = (token) => {
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
