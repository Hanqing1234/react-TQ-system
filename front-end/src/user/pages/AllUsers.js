import React, { useEffect, useState, useContext } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./AllUsers.css";

const AllUsers = () => {
  const [data, setData] = useState([]);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/all"
        );
        console.log(responseData.users);
        console.log(auth.role)
        //responseData.users.filter()
        setData(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.role]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
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
            <img className="userListImg" src={`${process.env.REACT_APP_ASSET_URL}/${params.row.image}`}  />
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
          <>
            <Button to={"/users/" + params.row.id}>
             Edit
            </Button>
            <DeleteOutline
              className="productListDelete"
              onClick={() => console.log(params.row.id)}
            />
          </>
        );
      }
    }
  ];

  return (
    <React.Fragment>
    <div className="userList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
      />
    </div>
    
    </React.Fragment>
  );
};

export default AllUsers;
