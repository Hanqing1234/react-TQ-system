const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const moment = require("moment");
const fs = require("fs");
//const getCoordsForAddress = require('../util/location');

const getTicket = async (req, res, next) => {
  const TicketId = req.params.pid;
  let ticket;
  try {
    ticket = await Ticket.findById(TicketId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Ticket.",
      500
    );
    return next(error);
  }

  if (!ticket) {
    const error = new HttpError(
      "Could not find a Ticket for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ ticket: ticket.toObject({ getters: true }) });
};

const getTickets = async (req, res, next) => {
  let ticket;
  try {
    ticket = await Ticket.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong111111, could not find a Ticket.",
      500
    );
    return next(error);
  }

  if (!ticket) {
    const error = new HttpError(
      "Could not find a Ticket for the provided id.",
      404
    );
    return next(error);
  }
  console.log(ticket);
  res.json({ tickets: ticket.map((Ticket) => Ticket.toObject({ getters: true })) });
};

const getTicketById = async (req, res, next) => {
  const TicketId = req.params.pid;

  let ticket;
  try {
    ticket = await Ticket.findById(TicketId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Ticket.",
      500
    );
    return next(error);
  }

  if (!ticket) {
    const error = new HttpError(
      "Could not find a Ticket for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ ticket: ticket.toObject({ getters: true }) });
};

const getTicketsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let tickets;
  let userWithTickets;
  try {
    userWithTickets = await User.findById(userId).populate("tickets");
  } catch (err) {
    const error = new HttpError(
      "Fetching tickets failed, please try again later",
      500
    );
    return next(error);
  }

  // if (!tickets || tickets.length === 0) {
  if (!userWithTickets || userWithTickets.tickets.length === 0) {
    return next(
      new HttpError("Could not find tickets for the provided user id.", 404)
    );
  }

  res.json({
    tickets: userWithTickets.tickets.map((Ticket) =>
      Ticket.toObject({ getters: true })
    ),
  });
};

const createTicket = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data-create.",
        422
      )
    );
  }

  const { title, description, cust_name, cust_email, message, assignee} = req.body;
  console.log(req.body);
  /*let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }*/

  const createdTicket = new Ticket({
    title,
    description,
    image: req.file ? req.file.path : null,
    cust_name,
    cust_email,
    message,
    assignee
  });
  console.log(createdTicket);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTicket.save({ session: sess });
    //user.tickets.push(createdTicket);
    //await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Ticket failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Ticket: createdTicket });
};

const updateTicket = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data-back-update.",
        422
      )
    );
  }
  console.log(req);
  const { message, ticket_status, assignee } = req.body;
  const ticketId = req.params.pid;

  let ticket;
  try {
    ticket = await Ticket.findById(ticketId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Ticket.",
      500
    );
    return next(error);
  }

  ticket.message = message;
  ticket.ticket_status = ticket_status;
  ticket.assignee = assignee;

  if (ticket.ticket_status === "3") {
    ticket.closed_date = moment(new Date(Date.now())).format("YYYY-MM-DD")
  }

  try {
    await ticket.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Ticket.",
      500
    );
    return next(error);
  }

  res.status(200).json({ ticket: ticket.toObject({ getters: true }) });
};

const deleteTicket = async (req, res, next) => {
  const TicketId = req.params.pid;
  console.log(TicketId);
  let ticket;
  try {
    ticket = await Ticket.findById(TicketId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Ticket.",
      500
    );
    return next(error);
  }

  if (!ticket) {
    const error = new HttpError("Could not find Ticket for this id.", 404);
    return next(error);
  }

  const imagePath = ticket.image;
  console.log(ticket);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ticket.remove({ session: sess });
    ticket.remove({ ticket: ticket });
    //Ticket.creator.tickets.pull(Ticket);
    //await Ticket.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Ticket.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted Ticket." });
};

exports.getTicket = getTicket;
exports.getTickets = getTickets;
exports.getTicketById = getTicketById;
exports.getTicketsByUserId = getTicketsByUserId;
exports.createTicket = createTicket;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;
