import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
    {auth.isLoggedIn && (
      <li>
        <NavLink to="/users/all" exact>
          All Users
        </NavLink>
      </li>
    )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/tickets/all">All tickets</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/tickets/new">New Ticket</NavLink>
        </li>
        )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
