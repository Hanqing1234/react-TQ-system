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
            src={`${process.env.REACT_APP_ASSET_URL}/${auth.image}`}
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
