import React, { useState, useContext } from "react";

import { Image } from "antd";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ModalTest from "../../shared/components/UIElements/ModalTest";
import Map from "../../shared/components/UIElements/Map";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./TicketItem.css";

const TicketItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/tickets/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (err) {}
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
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to delete?</p>
      </ModalTest>

      <li className="Ticket-item">
        <Card className="Ticket-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <Card className="Ticket-item__image">
            <Image
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </Card>
          <div className="Ticket-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="Ticket-item__actions">
            {auth && <Button to={`/tickets/${props.id}`}>DETAILS</Button>}
            {auth && (
              <Button danger onClick={showDeleteHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default TicketItem;
