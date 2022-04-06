import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Menu, MenuItem } from "@mui/material";
import Button from "../../shared/components/FormElements/Button";
import "./TicketList.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ModalTest from "../../shared/components/UIElements/ModalTest";

const TicketList = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rows, setRows] = React.useState();
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const [ticketRow, setTicketRow] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tickets/all`,
          "GET",
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        console.log(responseData.tickets);
        const ticket_status_show = {
          1: "Not Started",
          2: "In Progress",
          3: "Finished",
        };
        const changeStatusShowHandler = (item) => {
          item.ticket_status = ticket_status_show[item.ticket_status];
        };
        responseData.tickets.filter(changeStatusShowHandler);
        setRows(responseData.tickets);
      } catch (err) {}
    };
    fetchTickets();
  }, [sendRequest]);

  const showDeleteHandler = (cellValues) => {
    console.log(cellValues);
    setShowConfirmModal(true);
    setTicketRow(cellValues);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async (cellValues) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/tickets/${cellValues.row.id}`,
        "DELETE",
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      setRows((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== cellValues.row.id)
      );
    } catch (err) {}
  };

  const columns = [
    {
      field: "cust_name",
      headerName: "Name",
      width: 120,
    },
    {
      field: "cust_email",
      headerName: "Email",
      width: 140,
    },
    {
      field: "title",
      headerName: "Title",
      width: 120,
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
      field: "create_date",
      headerName: "Create Date",
      width: 140,
    },
    {
      field: "closed_date",
      headerName: "Closed Date",
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
              <Button inverse to={`/tickets/${cellValues.row.id}`}>
                Details
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
          <Button danger onClick={() => showDeleteHandler(cellValues)}>
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
      <ErrorModal error={error} onClear={clearError} />
      <ModalTest
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure"
        footerClass="Ticket-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={() => confirmDeleteHandler(ticketRow)}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to delete?</p>
      </ModalTest>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div style={{ height: 700, width: "100%" }}>
          {rows && (
            <DataGrid
            disableVirtualization
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
      )}
    </React.Fragment>
  );
};

export default TicketList;
