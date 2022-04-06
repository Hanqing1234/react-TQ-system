import React, { useState, useContext } from "react";

import "./Auth.css";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = (props) => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: { value: null, isValid: false },
        },
        false
      );
    }
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            Authorization: 'Bearer ' + auth.token,
            "Content-Type": "application/json",
          }
        );
        console.log(responseData)
        auth.login(responseData.userId, responseData.token, responseData.role, responseData.image, responseData.name);
      } catch (err) {}   
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Login Required</h1>
        <h6>username: admin@admin.com</h6>
        <h6>password: aaaaaa</h6>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="PLEASE ENTER A VALID EMAIL ADDRESS"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="PLEASE ENTER A VALID PASSWORD, AT LEAST 6 CHARACTERS"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
             LOGIN
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
