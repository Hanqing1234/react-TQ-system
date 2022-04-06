import Card from "../../shared/components/UIElements/Card";
import TicketItem from "./TicketItem";
import Button from '../../shared/components/FormElements/Button';

import "./TicketList.css";

const TicketList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="Ticket-list center">
        <Card>
          <h2>No tickets found! Created one?</h2>
          <Button to="/ticket/new">Share Ticket</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="Ticket-list">
      {props.items.map((Ticket) => (
        <TicketItem
          key={Ticket.id}
          id={Ticket.id}
          image={Ticket.image}
          title={Ticket.title}
          description={Ticket.description}
          //address={Ticket.address}
          //creatorId={Ticket.creator}
          //coordinates={Ticket.location}
          onDelete={props.onDeleteTicket} 
        />
      ))}
    </ul>
  );
};

export default TicketList;
