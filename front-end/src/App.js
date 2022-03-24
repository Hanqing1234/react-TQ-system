import React, { useState, useCallback, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import './App.css'
//import Users from "./user/pages/Users";
//import NewPlace from "./places/pages/NewPlace";
//import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import SideBar from "./shared/components/SideBar/SideBar";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { Container } from '@mui/material';

const FAQ = React.lazy(() => import("./user/pages/FAQ"));
const Users = React.lazy(() => import("./user/pages/User"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const TicketList = React.lazy(() => import("./places/pages/TicketList"));
const AllUsers = React.lazy(() => import("./user/pages/AllUsers"));
const SingleUser = React.lazy(() => import("./user/pages/SingleUser"));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <div className="main-content">
        <SideBar />
        <div style={{flex: 4}}>
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
    );
  } else {
    routes = (
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
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />   
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
