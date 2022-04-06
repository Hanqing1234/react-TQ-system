import React, { useEffect, useState,useContext } from "react";

import TicketList from "../components/TicketList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ModalTest from "../../shared/components/UIElements/ModalTest";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
const UserTickets = () => {
  const [loadedTickets, setLoadedTickets] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tickets/all`
        );
        console.log(responseData)
        setLoadedTickets(responseData.tickets);
      } catch (err) {}
    };
    fetchTickets();
  }, [sendRequest]);
  
  const TicketDeletedHandler = (deletedTicketId) => {
    setLoadedTickets(prevTickets => prevTickets.filter(Ticket => Ticket.id !== deletedTicketId))
  }
  console.log(loadedTickets)
  console.log(auth)
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTickets && <TicketList items={loadedTickets} onDeleteTicket={TicketDeletedHandler}/>}
    </React.Fragment>
  );
};

export default UserTickets;
