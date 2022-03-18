import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./PlaceForm.css";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
     /* address: {
        value: "",
        isValid: false,
      },*/
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      //formData.append("address", formState.inputs.address.value);
      //formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL + "/tickets/all", "POST", formData);
      //Redirect the user to a different page
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          errorText="Please enter a valid title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          errorText="Please enter a valid description"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
      
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please input an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
