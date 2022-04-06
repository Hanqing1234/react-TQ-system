import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
} from "@mui/material";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./NewUser.css";

const NewUser = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [roleInput, setRoleInput] = useState("representative");

  const [formState, inputHandler, setFormData] = useForm();

  const history = useHistory();

  const usernameInput = useRef();
  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const phoneInput = useRef();
  const addressInput = useRef();

  const roleChange = (event) => {
    setRoleInput(event.target.value);
  };

  const userSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", emailInput.current.value);
      formData.append("name", nameInput.current.value);
      formData.append("username", usernameInput.current.value);
      formData.append("password", passwordInput.current.value);
      formData.append("phone", phoneInput.current.value);
      formData.append("address", addressInput.current.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("role", roleInput);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        "POST",
        formData
      );
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form onSubmit={userSubmitHandler}>
        <button className="newUserButton">Create</button>
        <div className="newUserForm">
          <div className="newUserItem">
            <label>Username</label>
            <input type="text" ref={usernameInput} />
          </div>
          <div className="newUserItem">
            <label>Full Name</label>
            <input type="text" ref={nameInput} />
          </div>
          <div className="newUserItem">
            <label>Email</label>
            <input type="email" ref={emailInput} />
          </div>
          <div className="newUserItem">
            <label>Password</label>
            <input type="password" ref={passwordInput} />
          </div>
          <div className="newUserItem">
            <label>Phone</label>
            <input type="text" ref={phoneInput} />
          </div>
          <div className="newUserItem">
            <label>Address</label>
            <input type="text" ref={addressInput} />
          </div>
          <div className="newUserItem">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={roleInput}
                onChange={roleChange}
              >
                <FormControlLabel
                  value="Representative"
                  control={<Radio />}
                  label="Representative"
                />
                <FormControlLabel
                  value="Department Manager"
                  control={<Radio />}
                  label="Department Manager"
                />
                <FormControlLabel
                  value="Question Solver"
                  control={<Radio />}
                  label="Question Solver"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="newUserItem">
          <ImageUpload center id="image" onInput={inputHandler} />
        </div>
          </div>
      </form>
    </div>
    </React.Fragment>
  );
};

export default NewUser;
