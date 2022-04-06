const mongoose = require("mongoose");

const moment = require("moment");

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  ticket_status: { type: String, default: "1"},
  cust_name: { type: String, required: true },
  cust_email: { type: String, required: true },
  create_date: {
     type: String,
     default: moment(new Date(Date.now())).format("YYYY-MM-DD HH:mm:ss"),
   },
  message: { type: String, default: ""},
  closed_date: {
    type: String,
    default: "",
  },



});

module.exports = mongoose.model("Ticket", TicketSchema);
