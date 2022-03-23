import React from "react";

import ModalTest from "./ModalTest";
import Button from "../FormElements/Button";

const ErrorModal = (props) => {
  return (
    <ModalTest
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </ModalTest>
  );
};

export default ErrorModal;
