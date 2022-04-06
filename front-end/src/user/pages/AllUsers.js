import React, { useEffect, useState, useContext } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "../../shared/components/FormElements/Button";
import { Link, useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ModalTest from "../../shared/components/UIElements/ModalTest";

import "./AllUsers.css";

const AllUsers = () => {
  const [data, setData] = useState([]);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userRow, setUserRow] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/all",
          "GET",
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        console.log(responseData.users);
        console.log(auth.role);
        //responseData.users.filter()
        setData(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.role]);

  const showDeleteHandler = (cellValues) => {
    console.log(cellValues);
    setShowConfirmModal(true);
    setUserRow(cellValues);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const deleteSingleUser = (id) => {
    const temp = data.filter((item) => item.id !== id);
    setData(temp);
  };

  const confirmDeleteHandler = async (cellValues) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/users/${cellValues.row.id}`,
        "DELETE"
      );
      setData((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== cellValues.row.id)
      );
    } catch (err) {}
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <img
              className="userListImg"
              src={`${process.env.REACT_APP_ASSET_URL}/${params.row.image}`}
            />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email Address", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Button to={"/users/" + params.row.id}>Edit</Button>
            <DeleteOutline
              onClick={() => {
                showDeleteHandler(params);
              }}
              className="productListDelete"
            />
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    <ModalTest
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
      header="Are you sure"
      footerClass="place-item__modal-actions"
      footer={
        <React.Fragment>
          <Button inverse onClick={cancelDeleteHandler}>
            CANCEL
          </Button>
          <Button danger onClick={() => confirmDeleteHandler(userRow)}>
            DELETE
          </Button>
        </React.Fragment>
      }
    >
      <p>Do you want to delete?</p>
    </ModalTest>
    <div className="userTitleContainer">
    
    <Link to="/users/new">
      <button className="userAddButton">Create</button>
    </Link>
  </div>
      <div className="userList">
        <DataGrid rows={data} disableSelectionOnClick columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default AllUsers;
