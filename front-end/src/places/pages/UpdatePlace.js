import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext} from "../../shared/context/auth-context";
import "./PlaceForm.css";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const history = useHistory();

  const [loadedPlace, setLoadedPlace] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  console.log(formState.inputs);
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tickets/${placeId}`
        );
        console.log(responseData);
        setLoadedPlace(responseData);
        setFormData(
          {
            title: {
              value: responseData.places.title,
              isValid: true,
            },
            description: {
              value: responseData.places.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }
console.log(loadedPlace)
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.place.title}
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
            initialValue={loadedPlace.place.description}
            initialValid={true}
            disabled={true}
          />
          
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
