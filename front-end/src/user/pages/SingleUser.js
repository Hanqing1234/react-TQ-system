import React, { useEffect, useState } from "react";
import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./user.css";

const SingleUser = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        console.log(responseData);
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const userUpdateSubmitHandler = async (event) => {
    // console.log(formState.inputs);
    // try {
    //   await sendRequest(
    //     `${process.env.REACT_APP_BACKEND_URL}/tickets/${placeId}`,
    //     "PATCH",
    //     JSON.stringify({
    //       message: formState.inputs.message.value,
    //       ticket_status: status,
    //     }),
    //     {
    //       "Content-Type": "application/json",
    //     }
    //   );
    //   history.push("/tickets/all");
    // } catch (err) {}
    console.log(event);
  };

  console.log(loadedUser);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/auth">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            {loadedUser && (
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${loadedUser.image}`}
                alt=""
                className="userShowImg"
              />
            )}
            <div className="userShowTopTitle">
              {loadedUser && (
                <span className="userShowUsername">{loadedUser.name}</span>
              )}
              {loadedUser && (
                <span className="userShowUserTitle">{loadedUser.role}</span>
              )}
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              {loadedUser && (
                <span className="userShowInfoTitle">{loadedUser.name}</span>
              )}
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              {loadedUser && (
                <span className="userShowInfoTitle">
                  {loadedUser.create_date}
                </span>
              )}
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">+1 123 456 67</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              {loadedUser && (
                <span className="userShowInfoTitle">{loadedUser.email}</span>
              )}
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">Canada</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={userUpdateSubmitHandler}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                {loadedUser && (
                  <input
                    type="text"
                    placeholder={loadedUser.email}
                    className="userUpdateInput username"
                  />
                )}
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                {loadedUser && (
                  <input
                    type="text"
                    placeholder={loadedUser.name}
                    className="userUpdateInput fullName"
                  />
                )}
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                {loadedUser && (
                  <input
                    type="text"
                    placeholder={loadedUser.email}
                    className="userUpdateInput email"
                  />
                )}
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="+1 123 456 67"
                  className="userUpdateInput phoneNumber"
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Canada"
                  className="userUpdateInput address"
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                {loadedUser && (
                  <img
                    className="userUpdateImg"
                    src={`${process.env.REACT_APP_ASSET_URL}/${loadedUser.image}`}
                    alt=""
                  />
                )}
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="userUpdateButton" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
