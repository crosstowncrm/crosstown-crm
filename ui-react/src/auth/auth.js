import React from "react";

const auth =()=> {

    let inMemoryJWT = null;

    const getToken = () => sessionStorage.getItem("inMemoryJWT");

    const setToken = (token) => {
        sessionStorage.setItem("inMemoryJWT", token);
        return true;
    };

    const ereaseToken = () => {
        sessionStorage.setItem("inMemoryJWT", null);
        return true;
    }

    const isAuth = () => {
        return sessionStorage.getItem("inMemoryJWT") !== null? true : false
    }

    return {
        setToken, getToken, ereaseToken, isAuth
    }
};

export default auth()