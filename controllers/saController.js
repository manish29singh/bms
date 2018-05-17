var Mail = require('../configurations/mailing/mailComposer');
var dj = require('../configurations/default.json');
var userModel = require('../models/userModel');
var authController = require('../controllers/authController');
var util = require('../utils/util');
var buildingModel = require('../models/buildingModel')

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
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
                        role: dj.role.ADMIN,
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

/**
 * 
 * @param {Object} req 
 */
module.exports.getListOfInvitations = async function (req) {
    try {
        var userslist = await userModel.find({}, { password: 0 });

        console.log(userslist)
        return userslist;

    } catch (err) {
        res.json({ "message": err });
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} role 
 */
module.exports.getSaIndexPage = async function (req, res, role) {
    try {
        let userList = await userModel.find({ role: 'ADMIN' });
        if (userList) {
            res.render('index', { list: userList, role: role });
        }
    } catch (err) {
        res.json({ "message": err });
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.reInvite = async function (req, res) {
    try {
        let email = req.body.email,
            name = req.body.name,
            id = req.body.id;
        let checkUser = await userModel.findById(id);
        if (checkUser) {
            if (checkUser.email == email) {
                res.json({ 'message': 'Invitation already ahas been sent to this email address' });
                return;
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
                    let user = await userModel.findByIdAndUpdate(req.body.id, { email: email, name: name, token: token });
                    if (user) {
                        res.json({ "name": user.name, "email": email, "message": "Re-invitation mail has been sent to user." });
                        res.end();
                    }
                }

            }

        }
    } catch (err) {
        res.json({ "message": err });
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.changeStatus = async function (req, res) {
    try {
        let id = req.body.id;
        let active = req.body.status;
        let newStatus;
        console.log(active);
        if (active == 'false') {

            newStatus = true;
        }
        if (active == 'true') {
            newStatus = false;
        }
        if (id) {
            var user = await userModel.findByIdAndUpdate(id, { active: newStatus });
            if (user) {
                console.log(user.active);
                res.json({ 'id': user.id, 'status': user.active });
            }
        }
    } catch (err) {
        res.json({ "message": err });
    }
}

