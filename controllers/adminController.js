var Mail = require('../configurations/mailing/mailComposer');
var dj = require('../configurations/default.json');
var userModel = require('../models/userModel');
var authController = require('../controllers/authController');
var util = require('../utils/util');
var ticketModel = require('../models/ticketModel');

/**
 * method to get admin's index page
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} role 
 */
module.exports.getAdminIndexPage = async function (req, res, role) {
    try {
        let user  = await userModel.findById(req._passport.session.user);
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
        let userList = await userModel.find({ role: 'TENANT' });
        res.render('index', { list: userList, role: role, user: user, ticketList :  ticketList});
    } catch (err) {
        res.json({ "message": err });
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
var inviteUser = async function (req, res) {
    try {
        console.log('inviteUser function')
        if (req.body.email != '' && req.body.name != '') {
            var name = req.body.name,
                email = req.body.email;
            var checkUser = await authController.getUserByEmail(email);
            if (checkUser) {
                req.flash('error_msg', "An invitation has been already sent to this email id.");
                res.redirect('/');
            } else {
                var token = await util.generateToken();

                var inviteUrl = `https://${req.headers.host}/invitation/${token}`;

                var mailObj = {
                    "to": email,
                    "subject": dj.invitation_mail.subject,
                    "body": dj.invitation_mail.header + name + ", \n" + dj.invitation_mail.middle + "\n" + inviteUrl + "\n" + dj.invitation_mail.regards
                }
                var data = await Mail.sendMail(mailObj);
                if (data) {
                    console.log('mail sent')
                    var userObj = new userModel({
                        email: email,
                        name: name,
                        token: token,
                        role: dj.role.TENANT,
                        active: false,
                        createdby : req._passport.session.user
                    });

                    var user = userObj.save();
                    if (user) {
                        console.log('redirecting to index')
                        req.flash('success_msg', "Invitation has been sent.");
                        res.redirect('/');

                    }
                }

            }
        }
    } catch (err) {
        res.json({ "message": err });
    }
}

exports.inviteUser = inviteUser;

