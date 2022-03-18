import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
// UI external
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Accordion from "react-bootstrap/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAddressCard,
  faPersonWalkingLuggage,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ReactLogo from "./reactlogo.svg";
// UI internal
import "./FAQ.css";

const FAQ = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [FAQs, setFAQs] = useState([]);

  // -------- FAQs dummy --------
  const dummyFAQs = [
    {
      question: "How to become a premium memeber?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quo modo autem optimum, si bonum praeterea nullum est? Ex quo, id quod omnes expetunt, beate vivendi ratio inveniri et comparari potest. Sed fortuna fortis; At enim hic etiam dolore. Duo Reges: constructio interrete. In eo enim positum est id, quod dicimus esse expetendum. Atque ab isto capite fluere necesse est omnem rationem bonorum et malorum. Aliter autem vobis placet. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur.Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Quodsi ipsam honestatem undique pertectam atque absolutam. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec dicuntur inconstantissime.Cyrenaici quidem non recusant; Sic exclusis sententiis reliquorum cum praeterea nulla esse possit, haec antiquorum valeat necesse est. Dicimus aliquem hilare vivere; Cur ipse Pythagoras et Aegyptum lustravit et Persarum magos adiit?",
    },
    {
      question: "What's premium member policy?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quo modo autem optimum, si bonum praeterea nullum est? Ex quo, id quod omnes expetunt, beate vivendi ratio inveniri et comparari potest. Sed fortuna fortis; At enim hic etiam dolore. Duo Reges: constructio interrete. In eo enim positum est id, quod dicimus esse expetendum. Atque ab isto capite fluere necesse est omnem rationem bonorum et malorum. Aliter autem vobis placet. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur.Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Quodsi ipsam honestatem undique pertectam atque absolutam. Quarum ambarum rerum cum medicinam pollicetur, luxuriae licentiam pollicetur. Haec dicuntur inconstantissime.Cyrenaici quidem non recusant; Sic exclusis sententiis reliquorum cum praeterea nulla esse possit, haec antiquorum valeat necesse est. Dicimus aliquem hilare vivere; Cur ipse Pythagoras et Aegyptum lustravit et Persarum magos adiit?",
    },
    {
      question:
        "Can I finish my premium memebership within 1 year and get my refund?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor  Lorem ipsum dolor sit amet, seddo eiusmod tempor  Lorem ipsum dolor sit amet, seddo eiusmod tempor  Lorem ipsum dolor sit amet, seddo eiusmod tempor  Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute",
    },
    {
      question: "Where are physical shops in Canada?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute",
    },
    {
      question: "How can I apply to work at physical shops?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute",
    },
    {
      question:
        "I would like to return the product after 30 days of purchase, how should I do?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute",
    },
  ];

  useEffect(() => {
    setFAQs(dummyFAQs);
  }, []);

  // -------- search handler --------
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (event) => {
    const userInput = event.target.value;
    let matchingResult = [];

    // will fetch by API in iteration 2 , in iteration 1, we play with dummyFAQs instead.
    dummyFAQs.map((item) => {
      if (item.question.includes(userInput)) {
        matchingResult.push(item);
      }
    });

    console.log("matching" + matchingResult);
    setFAQs(matchingResult);
  };

  const optimisedVersion = useCallback(debounce(handleChange), []);

  // -------- DOM --------
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <div className="container">
          <div className="mt-2">&nbsp;</div>
          {/* title and picture */}
          <div className="text-center my-4">
            <img src={ReactLogo} alt="Logo" />
            <div className="mt-4">
              <h1>How can can we help you?</h1>
            </div>
          </div>
          {/* search */}
          <div className="form-group has-search">
            <span className="form-control-feedback">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search"
              onChange={optimisedVersion}
            />
          </div>

          <div className="mt-5"></div>
          {/* FAQ */}
          <div className="my-4">
            <div className="mb-2">
              <b>Frequent Ask Question</b>
            </div>
            <Accordion>
              {FAQs.map((item, key) => (
                <div key={key}>
                  <Accordion.Item eventKey={key}>
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body>
                      <span className="accordionBody">{item.answer}</span>
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              ))}
            </Accordion>
            <div className="m-4">&nbsp;</div>
          </div>
          {/* link to submit ticket */}
          <div className="mt-4 text-center">
            <Card>
              <Card.Body>
                <Card.Title>Need more help?</Card.Title>
                <Card.Text>Try submit and trace your question here :</Card.Text>
                <div className="d-flex justify-content-center">
                  <div className="mx-2 mb-3">
                    <NavLink to={`/users`}>
                      <Button variant="danger">
                        <FontAwesomeIcon icon={faAddressCard} size="1x" />
                        &nbsp;&nbsp;Submit new ticket
                      </Button>
                    </NavLink>
                  </div>
                  <div className="mx-2 mb-3">
                    <Button variant="warning">
                      <FontAwesomeIcon
                        icon={faPersonWalkingLuggage}
                        size="1x"
                      />
                      &nbsp;&nbsp;Trace exsist ticket
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="mt-2">&nbsp;</div>
        </div>
      )}
    </React.Fragment>
  );
};

export default FAQ;
