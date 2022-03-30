import React, { useContext } from "react";
import "./TopBar.css";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
import { Button } from '@mui/material';
import { AuthContext } from "../../context/auth-context";

const TopBar = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">TQ System Admin Panel</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img
            src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt=""
            className="topAvatar"
          />
          <div>
            <Button onClick={auth.logout}>logout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
