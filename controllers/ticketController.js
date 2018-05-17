var TicketModel = require('../models/ticketModel');
var buildingModel = require('../models/buildingModel');
var userModel = require('../models/userModel');
var defJson = require('../configurations/default.json');

module.exports.addTicket = async function (req, res) {
    if (req.method == 'GET') {
        let currentUser = req._passport.session.user || 0;
        res.render('ticket', { heading: "Create new Ticket", userId: currentUser });
    }
    if (req.method == 'POST') {
        try {
            let user = await userModel.findById(req._passport.session.user);
            if (user) {
                let date = new Date();
                console.log(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
                let building = await buildingModel.findOne({ owner_id: user.createdby })
                let newTicket = new TicketModel({
                    title: req.body.ticket_title,
                    description: req.body.ticket_description,
                    floor_no: req.body.ticket_floor,
                    createdby: req._passport.session.user,
                    creation_date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                    building_id: building.id,
                    building_owner: building.owner_id,
                    status: defJson.ticket_status.OPEN
                })
                let ticket = await newTicket.save();
                if (ticket) {
                    req.flash('success_msg', 'Ticket is raised successfully.');
                    res.redirect('/');
                } else {
                    req.flash('error_msg', 'Something went wrong.');
                    res.redirect('/');
                }

            }

        } catch (err) {
            throw err;
        }
    }
}


/**
 * changes status of the ticket
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.changeTicketStatus = async function (req, res) {
    try {
        let ticket = await TicketModel.findByIdAndUpdate(req.body.id, { status: req.body.status });
        if (ticket) {
            res.json({ 'message': 'updated', status: req.body.status });
        }
    } catch (err) {
        res.json({ "message": err });
    }

}

/**
 * show edit ticket form
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.showEditTicket = async function(req, res){
    try{
        let ticket = await TicketModel.findById(req.params.ticketId);
        if(ticket){
            res.render('ticket', {ticket: ticket});
        }else{
            req.flash('error_msg', 'Issue not found.');
        }
    }catch(err){
        res.send(err.message);
    }
}

/**
 * edit ticket 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.editTicket = async function (req, res) {
    try {
        console.log("ticket status ",req.body.ticket_status);
        let date = new Date();
        let ticket = await TicketModel.findByIdAndUpdate(req.body.ticket_id, {
            title: req.body.ticket_title,
            description: req.body.ticket_description,
            floor_no: req.body.ticket_floor,
            status: req.body.ticket_status,
            update_date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
        })
        if (ticket) {
            req.flash('success_msg', 'Ticket is updated successfully.');
            res.redirect('/');
        } else {
            req.flash('error_msg', 'Something went wrong.');
            res.redirect('/');
        }

    } catch (err) {
        res.send(err.message)
    }
}

/**
 * delete ticket
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.deleteTicket = async function(req, res){
    try{
        let ticket = await TicketModel.findByIdAndRemove(req.params.ticketId);
        if(ticket){
            req.flash('success_msg', 'Issue has been removed successfully.');
            res.redirect('/');
        }else{
            req.flash('error_msg', 'Issue not found.');
            res.redirect('/');
        }
    }catch(err){
        res.send(err.message);
    }
}