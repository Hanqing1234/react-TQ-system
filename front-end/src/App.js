import React, { useState, useCallback, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import "./App.css";
//import Users from "./user/pages/Users";
//import NewTicket from "./tickets/pages/NewTicket";
//import UserTickets from "./tickets/pages/UserTickets";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import SideBar from "./shared/components/SideBar/SideBar";
import TopBar from "./shared/components/TopBar/TopBar";
//import UpdateTicket from "./tickets/pages/UpdateTicket";
//import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { Container } from "@mui/material";

import { useAuth } from "./shared/hooks/auth-hook";

const FAQ = React.lazy(() => import("./user/pages/FAQ"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewTicket = React.lazy(() => import("./tickets/pages/NewTicket"));
const UpdateTicket = React.lazy(() => import("./tickets/pages/UpdateTicket"));
const TicketList = React.lazy(() => import("./tickets/pages/TicketList"));
const AllUsers = React.lazy(() => import("./user/pages/AllUsers"));
const SingleUser = React.lazy(() => import("./user/pages/SingleUser"));
const NewUser = React.lazy(() => import("./user/pages/NewUser"));

const App = () => {
  const { token, login, logout, userId, role, image, name } = useAuth();

  let routes;
console.log(routes);
  if (token && role ==='Admin') {
    routes = (
      <div>
        <TopBar />
        <div className="main-content">
          <SideBar />
          <div style={{ flex: 4 }}>
            <Switch>
              <Route path="/users/new" exact>
                <NewUser />
              </Route>
              <Route path="/users/all" exact>
                <AllUsers />
              </Route>
              <Route path="/users/:userId" exact>
                <SingleUser />
              </Route>
              <Route path="/tickets/all" exact>
                <TicketList />
              </Route>
              <Route path="/tickets/:ticketId" exact>
                <UpdateTicket />
              </Route>
              <Redirect to="/users/all" />
            </Switch>
          </div>

        </div>
      </div>
    );
  } else if (token && role !=='Admin'){
    routes = (
      <div>
        <TopBar />
        <div className="main-content">
          <SideBar />
          <div style={{ flex: 4 }}>
            <Switch>              
              <Route path="/tickets/all" exact>
                <TicketList />
              </Route>
              <Route path="/tickets/:ticketId" exact>
                <UpdateTicket />
              </Route>
              <Redirect to="/tickets/all" />
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
          <Route path="/:userId/tickets" exact>
            <TicketList />
          </Route>
          <Route path="/tickets/new" exact>
            <NewTicket />
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
        name: name,
        image: image,
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
