const mongoose = require("mongoose");

var Users = mongoose.model('employees', {
    name: { type: String },
    empid: { type: String, unique: true },
    password: { type: String },
    mobno: { type: Number },
    emailid: { type: String }
});

module.exports = { Users };