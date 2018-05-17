var userModel = require('../models/userModel');
var ticketModel = require('../models/ticketModel');
/**
 * method to get admin's index page
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} role 
 */
module.exports.getTenantIndexPage = async function (req, res, role) {
    try {
        let user = await userModel.findById(req._passport.session.user);
        if (user) {
            let ticketList = await ticketModel.aggregate([
                {
                    $lookup:{
                        from : "users",
                        localField : "createdby",
                        foreignField : "_id",
                        as : "user_docs"
                    }
                },
                {
                    $unwind : "$user_docs"
                }
            ])
            console.log(ticketList);
            res.render('index', { user: user, role: role, list: ticketList });
        }
    } catch (err) {
        res.json({ "message": err });
    }
}