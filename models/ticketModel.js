
const mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({
    title: {
        type : String
    },
    description: {
        type: String
    },
    createdby: Object,
    floor_no: String,
    creation_date: String,
    update_date: String,
    building_id: Object,
    status: String,
    building_owner : Object
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);