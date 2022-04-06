import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import { Image } from "antd";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";
import "./TicketForm.css";
import { Radio, RadioGroup, FormControlLabel, FormLabel, InputLabel, MenuItem,FormControl, Select } from "@mui/material";


import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const UpdateTicket = () => {
  const auth = useContext(AuthContext);
  const TicketId = useParams().ticketId;
  const history = useHistory();
  const [loadedTicket, setLoadedTicket] = useState('');
  const [status, setStatus] = useState();
  const [assignee, setAssignee] = React.useState('');
  const [user, setUser] = React.useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tickets/${TicketId}`,
          "GET",
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLoadedTicket(responseData);
        setStatus(responseData.Ticket.ticket_status);
      } catch (err) {}
    };
    fetchTicket();
  }, [sendRequest, TicketId, setFormData, setStatus]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/all"
        );
        //responseData.users.filter()
        setUser(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const TicketUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(assignee);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/tickets/${TicketId}`,
        "PATCH",
        JSON.stringify({
          message: formState.inputs.message.value,
          ticket_status: status,
          assignee: assignee,
        }),
        {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + auth.token,         
        }
      );
      history.push("/tickets/all");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedTicket && !error) {
    return (
      <div className="center">
        <h2>Could not find Ticket!</h2>
      </div>
    );
  }
  const changeRadio = (event) => {
    console.log(event.target.value);
    setStatus(event.target.value);
  };

  const assigneeChange = (event) => {
    setAssignee(event.target.value);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTicket && (
        <form className="Ticket-form" onSubmit={TicketUpdateSubmitHandler}>
          <Input
            id="cust_name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedTicket.ticket.cust_name}
            initialValid={true}
            disabled={true}
          />
          <Input
            id="cust_email"
            element="input"
            type="text"
            label="Email Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedTicket.ticket.cust_email}
            initialValid={true}
            disabled={true}
          />
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedTicket.ticket.title}
            initialValid={true}
            disabled={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedTicket.ticket.description}
            initialValid={true}
            disabled={true}
          />
          {loadedTicket.ticket.image && (
            <Card className="Ticket-item__image">
              <Image
                src={`${process.env.REACT_APP_ASSET_URL}/${loadedTicket.ticket.image}`}
                alt="1"
              />
            </Card>
          )}
          <Input
            id="message"
            element="textarea"
            label="Message"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a message"
            onInput={inputHandler}
            initialValue={loadedTicket.ticket.message}
            initialValid={true}
            disabled={false}
          />
          <Card className="Ticket-item__radio">
            <FormLabel id="status">Status</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="ticket_status"
              defaultValue={loadedTicket.ticket.ticket_status}
              onChange={changeRadio}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Not Started"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="In Progress"
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="Finished"
              />
            </RadioGroup>
          </Card>

          <Card className="Ticket-item__radio">
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Assignee</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={assignee}
            label="Assignee"
            onChange={assigneeChange}
          >
            {user.filter(user => user.role !== ("Admin" || "Representative"))
              .map((user) => (
              <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}

          </Select>
        </FormControl>
        </Card>
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE Ticket
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateTicket;
