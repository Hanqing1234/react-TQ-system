import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {  Container } from "@mui/material";
import Button from '../../shared/components/FormElements/Button';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";

const TicketList = () => {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [rows, setRows] = React.useState();
  const [selectedRow, setSelectedRow] = React.useState();

  const [contextMenu, setContextMenu] = React.useState(null);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tickets/all`
        );
        console.log(responseData);
        setRows(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  console.log(rows);
  console.log(auth);
  const columns = [
    {
      field: "cust_name",
      headerName: "Name",
      width: 140,
    },
    {
      field: "cust_email",
      headerName: "Email",
      width: 140,
    },
    {
      field: "title",
      headerName: "Title",
      width: 140,
    },
    {
        field: "description",
        headerName: "Description",
        width: 140,
      },
    {
      field: "ticket_status",
      headerName: "Status",
      width: 140,
    },
    {
      field: "edit",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <React.Fragment>
            {auth && (
              <Button
                inverse
                to={`/tickets/${cellValues.row.id}`}
              >
                Edit
              </Button>
            )}
          </React.Fragment>
        );
      },
    },
    {
      field: "remove",
      headerName: "",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <Button
            danger
          >
            Remove
          </Button>
        );
      },
    },
  ];

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute("data-id")));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const convertToUppercase = () => {
    const newRows = rows.map((row) => {
      if (row.id === selectedRow) {
        return {
          ...row,
          name: row.name.toUpperCase(),
          email: row.email.toUpperCase(),
          title: row.title.toUpperCase(),
        };
      }
      return row;
    });
    setRows(newRows);
    handleClose();
  };

  const convertToLowercase = () => {
    const newRows = rows.map((row) => {
      if (row.id === selectedRow) {
        return {
          ...row,
          name: row.name.toLowerCase(),
          email: row.email.toLowerCase(),
          title: row.title.toLowerCase(),
        };
      }
      return row;
    });
    setRows(newRows);
    handleClose();
  };

  return (
    <React.Fragment>
      <Container>
        <div style={{ height: 400, width: "100%" }}>
          {rows && (
            <DataGrid
              columns={columns}
              rows={rows}
              componentsProps={{
                row: {
                  onContextMenu: handleContextMenu,
                  style: { cursor: "context-menu" },
                },
              }}
            />
          )}
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
            componentsProps={{
              root: {
                onContextMenu: (e) => {
                  e.preventDefault();
                  handleClose();
                },
              },
            }}
          >
            <MenuItem onClick={convertToUppercase}>UPPERCASE</MenuItem>
            <MenuItem onClick={convertToLowercase}>lowercase</MenuItem>
          </Menu>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default TicketList;
