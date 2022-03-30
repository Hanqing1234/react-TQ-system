import React, { useState, useCallback, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import "./App.css";
//import Users from "./user/pages/Users";
//import NewPlace from "./places/pages/NewPlace";
//import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import SideBar from "./shared/components/SideBar/SideBar";
import TopBar from "./shared/components/TopBar/TopBar";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { Container } from "@mui/material";

import {useAuth} from './shared/hooks/auth-hook';

const FAQ = React.lazy(() => import("./user/pages/FAQ"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const TicketList = React.lazy(() => import("./places/pages/TicketList"));
const AllUsers = React.lazy(() => import("./user/pages/AllUsers"));
const SingleUser = React.lazy(() => import("./user/pages/SingleUser"));

const App = () => {
  const {token, login, logout, userId, role} = useAuth();

  let routes;

  if (token) {
    routes = (
      <div>
      <TopBar />
      <div className="main-content">
        <SideBar />
        <div style={{ flex: 4 }}>
          <Switch>
            <Route path="/users/all" exact>
              <AllUsers />
            </Route>
            <Route path="/users/:userId" exact>
              <SingleUser />
            </Route>
            <Route path="/tickets/all" exact>
              <TicketList />
            </Route>
            <Route path="/tickets/:placeId" exact>
              <UpdatePlace />
            </Route>
            <Redirect to="/users/all" />
          </Switch>
        </div>
      </div>
      </div>
    );
  } else {
    routes = (
      <div>
        <MainNavigation />
        <Switch>
          <Route path="/" exact>
            <FAQ />
          </Route>
          <Route path="/:userId/places" exact>
            <TicketList />
          </Route>
          <Route path="/tickets/new" exact>
            <NewPlace />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Redirect to="/auth" />
        </Switch>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
