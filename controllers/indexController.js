var userModel = require('../models/userModel');
var saController = require('./saController');
var adminController = require('./adminController');
var tenantController = require('./tenantController');

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.getIndexPage = async function(req,res){
    try{
        console.log('user des'+ req._passport.session.user);
        let user = await userModel.findById(req._passport.session.user);
       
        if(user){
            let userRole = user.role;
            console.log(userRole)
            //admin
            if(userRole=="ADMIN"){
             return  await adminController.getAdminIndexPage(req, res, userRole);
            }
            //super
            if(userRole == 0){
                return await saController.getSaIndexPage(req, res, userRole);
            }
             //tenant
             if(userRole == "TENANT"){
                return await tenantController.getTenantIndexPage(req, res, userRole);
            }
            else{
               return res.send('user not valid')
            }
        }
    }catch(err){
        res.send('something went wrong', err);
    }
}