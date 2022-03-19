import React from "react";

import Modaltest from "./Modaltest";
import Button from "../FormElements/Button";

const ErrorModal = (props) => {
  return (
    <Modaltest
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modaltest>
  );
};

export default ErrorModal;
